<?php

namespace App\Http\Controllers\Api\Stock;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use App\Models\Car;
use App\Jobs\SendStockUpdateNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class StockController extends Controller
{
    /**
     * Map car workflow status to a valid stocks.status enum value (does not mutate the car).
     */
    private function stockStatusForCar(?Car $car): string
    {
        $allowed = Stock::STATUSES;
        if (!$car || $car->status === null || $car->status === '') {
            return 'available';
        }

        $s = strtolower(trim((string) $car->status));
        if (in_array($s, $allowed, true)) {
            return $s;
        }

        $pendingLike = ['processing', 'incoming', 'before'];
        if (in_array($s, $pendingLike, true)) {
            return 'pending';
        }

        return 'available';
    }

    /**
     * Display a listing of stocks with filtering and search
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Stock::with(['car.category', 'car.subcategory', 'car.photos']);

            // Apply filters
            $query->byStatus($request->get('status'))
                  ->byPriceRange($request->get('min_price'), $request->get('max_price'))
                  ->byQuantityRange($request->get('min_quantity'), $request->get('max_quantity'))
                  ->searchByCar($request->get('search'));

            // Apply sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $page = $request->get('page', 1);
            $stocks = $query->paginate($perPage, ['*'], 'page', $page);

            return response()->json([
                'success' => true,
                'data' => $stocks->items(),
                'current_page' => $stocks->currentPage(),
                'last_page' => $stocks->lastPage(),
                'per_page' => $stocks->perPage(),
                'total' => $stocks->total(),
                'message' => 'Stocks retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve stocks',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created stock
     */
    public function store(Request $request): JsonResponse
    {
        try {
            // Check if using new format (make, model, package, car_ids) or old format (car_id)
            $isBulkMode = $request->has('car_ids') && is_array($request->car_ids) && count($request->car_ids) > 0;

            // Use unified validation that handles both modes
            // quantity/status from client are ignored: quantity is always 1; status is not taken from the request.
            $rules = [
                'quantity' => 'nullable|integer|min:0',
                'price' => 'nullable|numeric|min:0',
                'status' => ['nullable', Rule::in(Stock::STATUSES)],
                'notes' => 'nullable|string|max:1000',
            ];

            if ($isBulkMode) {
                $rules['make'] = 'required|string';
                $rules['model'] = 'required|string';
                $rules['package'] = 'nullable|string';
                $rules['car_ids'] = 'required|array|min:1';
                $rules['car_ids.*'] = 'required|exists:cars,id';
            } else {
                $rules['car_id'] = 'required|exists:cars,id';
            }

            $validator = Validator::make($request->all(), $rules);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            if ($isBulkMode) {
                // Bulk mode: Create/update stock for all cars with same make+model+package
                $carIds = $request->car_ids;
                $createdStocks = [];
                $updatedCount = 0;

                foreach ($carIds as $carId) {
                    $car = Car::find($carId);
                    // Check if stock already exists for this car
                    $existingStock = Stock::where('car_id', $carId)->first();

                    if ($existingStock) {
                        // Preserve stock status; quantity is always 1 (never driven to 0 here).
                        $existingStock->update([
                            'quantity' => 1,
                            'price' => $request->price,
                            'notes' => $request->notes,
                        ]);
                        $updatedCount++;
                        $createdStocks[] = $existingStock;
                    } else {
                        // New stock: status follows car (request status is ignored); car record is not modified.
                        $stock = Stock::create([
                            'car_id' => $carId,
                            'quantity' => 1,
                            'price' => $request->price,
                            'status' => $this->stockStatusForCar($car),
                            'notes' => $request->notes,
                        ]);
                        $createdStocks[] = $stock;
                    }
                }

                // Load relationships for first stock
                if (!empty($createdStocks)) {
                    $createdStocks[0]->load(['car.category', 'car.subcategory', 'car.photos']);
                }

                DB::commit();

                return response()->json([
                    'success' => true,
                    'data' => $createdStocks[0] ?? null,
                    'message' => count($createdStocks) > 0
                        ? "Stock created/updated for " . count($createdStocks) . " car(s) (Created: " . (count($createdStocks) - $updatedCount) . ", Updated: " . $updatedCount . ")"
                        : 'Stock created successfully'
                ], 201);
            } else {
                // Legacy mode: Single car stock creation
                $existingStock = Stock::where('car_id', $request->car_id)->first();
                if ($existingStock) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Stock already exists for this car. Use update instead.',
                    ], 409);
                }

                $car = Car::find($request->car_id);
                $stock = Stock::create([
                    'car_id' => $request->car_id,
                    'quantity' => 1,
                    'price' => $request->price,
                    'status' => $this->stockStatusForCar($car),
                    'notes' => $request->notes,
                ]);

                DB::commit();

                $stock->load(['car.category', 'car.subcategory', 'car.photos']);

                return response()->json([
                    'success' => true,
                    'data' => $stock,
                    'message' => 'Stock created successfully'
                ], 201);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified stock
     */
    public function show(Stock $stock): JsonResponse
    {
        try {
            $stock->load(['car.category', 'car.subcategory', 'car.photos', 'car.details']);

            return response()->json([
                'success' => true,
                'data' => $stock,
                'message' => 'Stock retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified stock
     */
    public function update(Request $request, Stock $stock): JsonResponse
    {
        try {
            // Log the update attempt
            \Log::info('Stock update attempt', [
                'stock_id' => $stock->id,
                'request_data' => $request->all()
            ]);

            // Check if using new format (make, model, package, car_ids) or old format
            $isBulkMode = $request->has('car_ids') && is_array($request->car_ids);

            // quantity/status from client are ignored (same rules as store): quantity is always 1; stock status is not updated from the request.
            if ($isBulkMode) {
                $validator = Validator::make($request->all(), [
                    'make' => 'required|string',
                    'model' => 'required|string',
                    'package' => 'nullable|string',
                    'car_ids' => 'required|array',
                    'car_ids.*' => 'exists:cars,id',
                    'quantity' => 'nullable|integer|min:0',
                    'price' => 'sometimes|nullable|numeric|min:0',
                    'status' => ['nullable', Rule::in(Stock::STATUSES)],
                    'notes' => 'sometimes|nullable|string|max:1000',
                ]);
            } else {
                $validator = Validator::make($request->all(), [
                    'quantity' => 'nullable|integer|min:0',
                    'price' => 'sometimes|nullable|numeric|min:0',
                    'status' => ['nullable', Rule::in(Stock::STATUSES)],
                    'notes' => 'sometimes|nullable|string|max:1000',
                ]);
            }

            if ($validator->fails()) {
                \Log::warning('Stock update validation failed', [
                    'stock_id' => $stock->id,
                    'errors' => $validator->errors()
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            if ($isBulkMode) {
                // Bulk mode: Update stock for all cars with same make+model+package
                $carIds = $request->car_ids;
                $updatedStocks = [];
                $updatedCount = 0;

                foreach ($carIds as $carId) {
                    $existingStock = Stock::where('car_id', $carId)->first();

                    if ($existingStock) {
                        $payload = ['quantity' => 1];
                        if ($request->has('price')) {
                            $payload['price'] = $request->price;
                        }
                        if ($request->has('notes')) {
                            $payload['notes'] = $request->notes;
                        }

                        $existingStock->update($payload);
                        $updatedStocks[] = $existingStock;
                        $updatedCount++;
                    }
                }

                // Load relationships for first stock
                if (!empty($updatedStocks)) {
                    $updatedStocks[0]->load(['car.category', 'car.subcategory', 'car.photos']);
                }

                DB::commit();

                $notifyData = [];
                if ($request->has('price')) {
                    $notifyData['price'] = $request->price;
                }
                if ($request->has('notes')) {
                    $notifyData['notes'] = $request->notes;
                }

                \Log::info('Bulk stock update successful', [
                    'updated_count' => $updatedCount,
                    'updated_fields' => array_merge(['quantity'], array_keys($notifyData)),
                ]);

                if (!empty($notifyData) && !empty($updatedStocks)) {
                    try {
                        SendStockUpdateNotification::dispatch($updatedStocks[0], $notifyData);
                    } catch (\Exception $e) {
                        \Log::error('Failed to dispatch stock update notification job', [
                            'error' => $e->getMessage()
                        ]);
                    }
                }

                return response()->json([
                    'success' => true,
                    'data' => $updatedStocks[0] ?? $stock,
                    'message' => "Stock updated for " . $updatedCount . " car(s)"
                ]);
            } else {
                // Legacy mode: Single stock update — quantity forced to 1; status never from request; car unchanged.
                $payload = ['quantity' => 1];
                if ($request->has('price')) {
                    $payload['price'] = $request->price;
                }
                if ($request->has('notes')) {
                    $payload['notes'] = $request->notes;
                }
                $stock->update($payload);

                DB::commit();

                $stock->load(['car.category', 'car.subcategory', 'car.photos']);

                $notifyData = [];
                if ($request->has('price')) {
                    $notifyData['price'] = $request->price;
                }
                if ($request->has('notes')) {
                    $notifyData['notes'] = $request->notes;
                }

                \Log::info('Stock updated successfully', [
                    'stock_id' => $stock->id,
                    'updated_fields' => array_merge(['quantity'], array_keys($notifyData)),
                ]);

                if (!empty($notifyData)) {
                    try {
                        SendStockUpdateNotification::dispatch($stock, $notifyData);
                        \Log::info('Stock update notification job dispatched', [
                            'stock_id' => $stock->id
                        ]);
                    } catch (\Exception $e) {
                        \Log::error('Failed to dispatch stock update notification job', [
                            'stock_id' => $stock->id,
                            'error' => $e->getMessage()
                        ]);
                    }
                }

                return response()->json([
                    'success' => true,
                    'data' => $stock,
                    'message' => 'Stock updated successfully'
                ]);
            }

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Stock update failed', [
                'stock_id' => $stock->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified stock
     */
    public function destroy(Stock $stock): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Do not change car status or quantity when removing the stock row.
            $stock->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Stock deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete stock',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get stock statistics
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total_stocks' => Stock::count(),
                'total_quantity' => Stock::sum('quantity'),
                'total_value' => Stock::sum(DB::raw('quantity * COALESCE(price, 0)')),
                'by_status' => Stock::select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->get(),
                'by_category' => Stock::join('cars', 'stocks.car_id', '=', 'cars.id')
                    ->join('categories', 'cars.category_id', '=', 'categories.id')
                    ->select('categories.name', DB::raw('count(*) as count'))
                    ->groupBy('categories.id', 'categories.name')
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'message' => 'Stock statistics retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve stock statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update stock statuses
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'stock_ids' => 'required|array',
                'stock_ids.*' => 'exists:stocks,id',
                'status' => ['required', Rule::in(Stock::STATUSES)],
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $stocks = Stock::whereIn('id', $request->stock_ids)->get();

            foreach ($stocks as $stock) {
                $stock->update(['status' => $request->status]);

                // Update car status
                if ($stock->car) {
                    $stock->car->update(['status' => $request->status]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Stock statuses updated successfully',
                'updated_count' => count($stocks)
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update stock statuses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available cars for stock creation
     */
    public function getAvailableCars(): JsonResponse
    {
        try {
            $cars = Car::whereNotIn('id', Stock::pluck('car_id'))
                ->with(['category', 'subcategory', 'photos'])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $cars,
                'message' => 'Available cars retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve available cars',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

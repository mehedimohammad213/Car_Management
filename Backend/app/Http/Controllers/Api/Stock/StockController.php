<?php

namespace App\Http\Controllers\Api\Stock;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class StockController extends Controller
{
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
            $validator = Validator::make($request->all(), [
                'car_id' => 'required|exists:cars,id',
                'quantity' => 'required|integer|min:0',
                'price' => 'nullable|numeric|min:0',
                'status' => 'required|in:available,sold,reserved,damaged,lost,stolen',
                'notes' => 'nullable|string|max:1000',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if stock already exists for this car
            $existingStock = Stock::where('car_id', $request->car_id)->first();
            if ($existingStock) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stock already exists for this car. Use update instead.',
                ], 409);
            }

            DB::beginTransaction();

            $stock = Stock::create($request->all());

            // Update car status if stock is created
            $car = Car::find($request->car_id);
            if ($car) {
                $car->update(['status' => $request->status]);
            }

            DB::commit();

            $stock->load(['car.category', 'car.subcategory', 'car.photos']);

            return response()->json([
                'success' => true,
                'data' => $stock,
                'message' => 'Stock created successfully'
            ], 201);

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

            $validator = Validator::make($request->all(), [
                'quantity' => 'sometimes|integer|min:0',
                'price' => 'sometimes|nullable|numeric|min:0',
                'status' => 'sometimes|in:available,sold,reserved,damaged,lost,stolen',
                'notes' => 'sometimes|nullable|string|max:1000',
            ]);

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

            // Only update fields that are provided in the request
            $updateData = $request->only(['quantity', 'price', 'status', 'notes']);
            $stock->update($updateData);

            // Update car status if stock status changed
            if ($request->has('status') && $stock->car) {
                $stock->car->update(['status' => $request->status]);
                \Log::info('Car status updated', [
                    'car_id' => $stock->car->id,
                    'new_status' => $request->status
                ]);
            }

            DB::commit();

            $stock->load(['car.category', 'car.subcategory', 'car.photos']);

            \Log::info('Stock updated successfully', [
                'stock_id' => $stock->id,
                'updated_fields' => array_keys($updateData)
            ]);

            return response()->json([
                'success' => true,
                'data' => $stock,
                'message' => 'Stock updated successfully'
            ]);

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

            // Update car status to available if stock is deleted
            if ($stock->car) {
                $stock->car->update(['status' => 'available']);
            }

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
                'status' => 'required|in:available,sold,reserved,damaged,lost,stolen',
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

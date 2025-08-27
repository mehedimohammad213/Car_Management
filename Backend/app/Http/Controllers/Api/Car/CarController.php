<?php

namespace App\Http\Controllers\Api\Car;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CarController extends Controller
{
    /**
     * Display a listing of cars with search, filter, and pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Car::with(['category', 'subcategory', 'primaryPhoto']);

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $query->search($request->search);
            }

            // Filter by status
            if ($request->has('status') && !empty($request->status)) {
                $query->byStatus($request->status);
            }

            // Filter by category
            if ($request->has('category_id') && !empty($request->category_id)) {
                $query->byCategory($request->category_id);
            }

            // Filter by subcategory
            if ($request->has('subcategory_id') && !empty($request->subcategory_id)) {
                $query->bySubcategory($request->subcategory_id);
            }

            // Filter by make
            if ($request->has('make') && !empty($request->make)) {
                $query->byMake($request->make);
            }

            // Filter by year range
            if ($request->has('year_from') && $request->has('year_to')) {
                $query->byYearRange($request->year_from, $request->year_to);
            } elseif ($request->has('year')) {
                $query->byYear($request->year);
            }

            // Filter by price range
            if ($request->has('price_from') && $request->has('price_to')) {
                $query->byPriceRange($request->price_from, $request->price_to);
            }

            // Filter by mileage range
            if ($request->has('mileage_from') && $request->has('mileage_to')) {
                $query->byMileageRange($request->mileage_from, $request->mileage_to);
            }

            // Filter by transmission
            if ($request->has('transmission') && !empty($request->transmission)) {
                $query->byTransmission($request->transmission);
            }

            // Filter by fuel
            if ($request->has('fuel') && !empty($request->fuel)) {
                $query->byFuel($request->fuel);
            }

            // Filter by color
            if ($request->has('color') && !empty($request->color)) {
                $query->byColor($request->color);
            }

            // Filter by drive
            if ($request->has('drive') && !empty($request->drive)) {
                $query->byDrive($request->drive);
            }

            // Filter by steering
            if ($request->has('steering') && !empty($request->steering)) {
                $query->bySteering($request->steering);
            }

            // Filter by country
            if ($request->has('country') && !empty($request->country)) {
                $query->byCountry($request->country);
            }

            // Sort functionality
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $allowedSortFields = [
                'id', 'ref_no', 'make', 'model', 'year', 'mileage_km', 
                'price_amount', 'status', 'created_at', 'updated_at'
            ];
            
            if (in_array($sortBy, $allowedSortFields)) {
                $query->orderBy($sortBy, $sortOrder);
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $perPage = min(max($perPage, 1), 100); // Limit between 1 and 100

            $cars = $query->paginate($perPage);

            // Transform data for response
            $data = $cars->getCollection()->map(function ($car) {
                return [
                    'id' => $car->id,
                    'ref_no' => $car->ref_no,
                    'make' => $car->make,
                    'model' => $car->model,
                    'model_code' => $car->model_code,
                    'variant' => $car->variant,
                    'full_name' => $car->full_name,
                    'year' => $car->year,
                    'reg_year_month' => $car->reg_year_month,
                    'mileage_km' => $car->mileage_km,
                    'formatted_mileage' => $car->formatted_mileage,
                    'engine_cc' => $car->engine_cc,
                    'formatted_engine' => $car->formatted_engine,
                    'transmission' => $car->transmission,
                    'drive' => $car->drive,
                    'steering' => $car->steering,
                    'fuel' => $car->fuel,
                    'color' => $car->color,
                    'seats' => $car->seats,
                    'grade_overall' => $car->grade_overall,
                    'grade_exterior' => $car->grade_exterior,
                    'grade_interior' => $car->grade_interior,
                    'price_amount' => $car->price_amount,
                    'price_currency' => $car->price_currency,
                    'formatted_price' => $car->formatted_price,
                    'price_basis' => $car->price_basis,
                    'chassis_no_masked' => $car->chassis_no_masked,
                    'location' => $car->location,
                    'country_origin' => $car->country_origin,
                    'status' => $car->status,
                    'notes' => $car->notes,
                    'category' => $car->category ? [
                        'id' => $car->category->id,
                        'name' => $car->category->name
                    ] : null,
                    'subcategory' => $car->subcategory ? [
                        'id' => $car->subcategory->id,
                        'name' => $car->subcategory->name
                    ] : null,
                    'primary_photo_url' => $car->primary_photo_url,
                    'photos_count' => $car->photos_count,
                    'created_at' => $car->created_at->toISOString(),
                    'updated_at' => $car->updated_at->toISOString(),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Cars retrieved successfully',
                'status_code' => 200,
                'data' => [
                    'cars' => $data,
                    'pagination' => [
                        'current_page' => $cars->currentPage(),
                        'last_page' => $cars->lastPage(),
                        'per_page' => $cars->perPage(),
                        'total' => $cars->total(),
                        'from' => $cars->firstItem(),
                        'to' => $cars->lastItem(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve cars: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Store a newly created car
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'category_id' => 'required|exists:categories,id',
                'subcategory_id' => 'nullable|exists:categories,id',
                'ref_no' => 'nullable|string|max:32|unique:cars,ref_no',
                'make' => 'required|string|max:64',
                'model' => 'required|string|max:64',
                'model_code' => 'nullable|string|max:32',
                'variant' => 'nullable|string|max:128',
                'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
                'reg_year_month' => 'nullable|string|max:7',
                'mileage_km' => 'nullable|integer|min:0',
                'engine_cc' => 'nullable|integer|min:0',
                'transmission' => 'nullable|string|max:32',
                'drive' => 'nullable|string|max:32',
                'steering' => 'nullable|string|max:16',
                'fuel' => 'nullable|string|max:32',
                'color' => 'nullable|string|max:64',
                'seats' => 'nullable|integer|min:1|max:20',
                'grade_overall' => 'nullable|numeric|min:0|max:5',
                'grade_exterior' => 'nullable|string|max:1',
                'grade_interior' => 'nullable|string|max:1',
                'price_amount' => 'nullable|numeric|min:0',
                'price_currency' => 'nullable|string|max:3',
                'price_basis' => 'nullable|string|max:32',
                'chassis_no_masked' => 'nullable|string|max:32',
                'chassis_no_full' => 'nullable|string|max:64',
                'location' => 'nullable|string|max:128',
                'country_origin' => 'nullable|string|max:64',
                'status' => 'nullable|string|max:32',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'status_code' => 422,
                    'data' => [
                        'errors' => $validator->errors()
                    ]
                ], 422);
            }

            $data = $validator->validated();
            $car = Car::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Car created successfully',
                'status_code' => 201,
                'data' => [
                    'car' => [
                        'id' => $car->id,
                        'ref_no' => $car->ref_no,
                        'make' => $car->make,
                        'model' => $car->model,
                        'full_name' => $car->full_name,
                        'year' => $car->year,
                        'status' => $car->status,
                        'created_at' => $car->created_at->toISOString(),
                        'updated_at' => $car->updated_at->toISOString(),
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create car: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Display the specified car
     */
    public function show($id): JsonResponse
    {
        try {
            $car = Car::with(['category', 'subcategory', 'photos'])->find($id);

            if (!$car) {
                return response()->json([
                    'success' => false,
                    'message' => 'Car not found',
                    'status_code' => 404,
                    'data' => []
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Car retrieved successfully',
                'status_code' => 200,
                'data' => [
                    'car' => [
                        'id' => $car->id,
                        'ref_no' => $car->ref_no,
                        'make' => $car->make,
                        'model' => $car->model,
                        'model_code' => $car->model_code,
                        'variant' => $car->variant,
                        'full_name' => $car->full_name,
                        'year' => $car->year,
                        'reg_year_month' => $car->reg_year_month,
                        'mileage_km' => $car->mileage_km,
                        'formatted_mileage' => $car->formatted_mileage,
                        'engine_cc' => $car->engine_cc,
                        'formatted_engine' => $car->formatted_engine,
                        'transmission' => $car->transmission,
                        'drive' => $car->drive,
                        'steering' => $car->steering,
                        'fuel' => $car->fuel,
                        'color' => $car->color,
                        'seats' => $car->seats,
                        'grade_overall' => $car->grade_overall,
                        'grade_exterior' => $car->grade_exterior,
                        'grade_interior' => $car->grade_interior,
                        'price_amount' => $car->price_amount,
                        'price_currency' => $car->price_currency,
                        'formatted_price' => $car->formatted_price,
                        'price_basis' => $car->price_basis,
                        'chassis_no_masked' => $car->chassis_no_masked,
                        'chassis_no_full' => $car->chassis_no_full,
                        'location' => $car->location,
                        'country_origin' => $car->country_origin,
                        'status' => $car->status,
                        'notes' => $car->notes,
                        'category' => $car->category ? [
                            'id' => $car->category->id,
                            'name' => $car->category->name
                        ] : null,
                        'subcategory' => $car->subcategory ? [
                            'id' => $car->subcategory->id,
                            'name' => $car->subcategory->name
                        ] : null,
                        'photos' => $car->photos->map(function ($photo) {
                            return [
                                'id' => $photo->id,
                                'image_url' => $photo->image_url,
                                'is_primary' => $photo->is_primary,
                                'caption' => $photo->caption,
                            ];
                        }),
                        'photos_count' => $car->photos_count,
                        'created_at' => $car->created_at->toISOString(),
                        'updated_at' => $car->updated_at->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve car: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Update the specified car
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $car = Car::find($id);

            if (!$car) {
                return response()->json([
                    'success' => false,
                    'message' => 'Car not found',
                    'status_code' => 404,
                    'data' => []
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'category_id' => 'sometimes|required|exists:categories,id',
                'subcategory_id' => 'nullable|exists:categories,id',
                'ref_no' => ['nullable', 'string', 'max:32', Rule::unique('cars')->ignore($id)],
                'make' => 'sometimes|required|string|max:64',
                'model' => 'sometimes|required|string|max:64',
                'model_code' => 'nullable|string|max:32',
                'variant' => 'nullable|string|max:128',
                'year' => 'sometimes|required|integer|min:1900|max:' . (date('Y') + 1),
                'reg_year_month' => 'nullable|string|max:7',
                'mileage_km' => 'nullable|integer|min:0',
                'engine_cc' => 'nullable|integer|min:0',
                'transmission' => 'nullable|string|max:32',
                'drive' => 'nullable|string|max:32',
                'steering' => 'nullable|string|max:16',
                'fuel' => 'nullable|string|max:32',
                'color' => 'nullable|string|max:64',
                'seats' => 'nullable|integer|min:1|max:20',
                'grade_overall' => 'nullable|numeric|min:0|max:5',
                'grade_exterior' => 'nullable|string|max:1',
                'grade_interior' => 'nullable|string|max:1',
                'price_amount' => 'nullable|numeric|min:0',
                'price_currency' => 'nullable|string|max:3',
                'price_basis' => 'nullable|string|max:32',
                'chassis_no_masked' => 'nullable|string|max:32',
                'chassis_no_full' => 'nullable|string|max:64',
                'location' => 'nullable|string|max:128',
                'country_origin' => 'nullable|string|max:64',
                'status' => 'nullable|string|max:32',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'status_code' => 422,
                    'data' => [
                        'errors' => $validator->errors()
                    ]
                ], 422);
            }

            $data = $validator->validated();
            $car->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Car updated successfully',
                'status_code' => 200,
                'data' => [
                    'car' => [
                        'id' => $car->id,
                        'ref_no' => $car->ref_no,
                        'make' => $car->make,
                        'model' => $car->model,
                        'full_name' => $car->full_name,
                        'year' => $car->year,
                        'status' => $car->status,
                        'created_at' => $car->created_at->toISOString(),
                        'updated_at' => $car->updated_at->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update car: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Remove the specified car
     */
    public function destroy($id): JsonResponse
    {
        try {
            $car = Car::find($id);

            if (!$car) {
                return response()->json([
                    'success' => false,
                    'message' => 'Car not found',
                    'status_code' => 404,
                    'data' => []
                ], 404);
            }

            // Delete associated photos
            foreach ($car->photos as $photo) {
                if ($photo->image) {
                    Storage::disk('public')->delete($photo->image);
                }
                $photo->delete();
            }

            $car->delete();

            return response()->json([
                'success' => true,
                'message' => 'Car deleted successfully',
                'status_code' => 200,
                'data' => []
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete car: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Get car statistics
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = [
                'total_cars' => Car::count(),
                'available_cars' => Car::available()->count(),
                'sold_cars' => Car::sold()->count(),
                'reserved_cars' => Car::reserved()->count(),
                'cars_by_make' => Car::selectRaw('make, COUNT(*) as count')
                    ->groupBy('make')
                    ->orderBy('count', 'desc')
                    ->limit(10)
                    ->get(),
                'cars_by_year' => Car::selectRaw('year, COUNT(*) as count')
                    ->groupBy('year')
                    ->orderBy('year', 'desc')
                    ->limit(10)
                    ->get(),
                'cars_by_status' => Car::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Car statistics retrieved successfully',
                'status_code' => 200,
                'data' => [
                    'statistics' => $stats
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve car statistics: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Get filter options for cars
     */
    public function getFilterOptions(): JsonResponse
    {
        try {
            $options = [
                'makes' => Car::distinct()->pluck('make')->filter()->sort()->values(),
                'transmissions' => Car::distinct()->pluck('transmission')->filter()->sort()->values(),
                'fuels' => Car::distinct()->pluck('fuel')->filter()->sort()->values(),
                'colors' => Car::distinct()->pluck('color')->filter()->sort()->values(),
                'drives' => Car::distinct()->pluck('drive')->filter()->sort()->values(),
                'steerings' => Car::distinct()->pluck('steering')->filter()->sort()->values(),
                'countries' => Car::distinct()->pluck('country_origin')->filter()->sort()->values(),
                'statuses' => Car::distinct()->pluck('status')->filter()->sort()->values(),
                'years' => Car::distinct()->pluck('year')->sort()->values(),
                'categories' => Category::select('id', 'name')->orderBy('name')->get(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Filter options retrieved successfully',
                'status_code' => 200,
                'data' => [
                    'filter_options' => $options
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve filter options: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }
}

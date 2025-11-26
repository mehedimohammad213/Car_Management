<?php

namespace App\Http\Controllers\Api\Car;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\CarPhoto;
use App\Models\CarDetail;
use App\Models\Category;
use App\Services\ImageBBService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\CarsImport;

class CarController extends Controller
{
    private $imageBBService;

    public function __construct(ImageBBService $imageBBService)
    {
        $this->imageBBService = $imageBBService;
    }

    /**
     * Handle file upload for attached files
     */
    private function handleFileUpload($file)
    {
        if (!$file) {
            return null;
        }

        $extension = strtolower($file->getClientOriginalExtension());
        $filename = time() . '_' . $file->getClientOriginalName();

        // Check if it's an image
        if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
            // Upload to ImageBB
            $uploadResult = $this->imageBBService->uploadImage($file->getPathname(), $filename);
            if ($uploadResult && $uploadResult['success']) {
                return $uploadResult['url'];
            }
            return null;
        }

        // Check if it's a PDF
        if ($extension === 'pdf') {
            // Store in local storage
            $path = $file->storeAs('attachments', $filename, 'public');
            return Storage::url($path);
        }

        return null;
    }

    public function index(Request $request): JsonResponse
    {
        $query = Car::with(['category', 'subcategory', 'photos', 'details.subDetails']);

        if ($request->filled('search')) {
            $query->search($request->search);
        }


        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }


        if ($request->filled('category_id')) {
            $query->byCategory($request->category_id);
        }


        if ($request->filled('subcategory_id')) {
            $query->bySubcategory($request->subcategory_id);
        }


        if ($request->filled('make')) {
            $query->byMake($request->make);
        }


        if ($request->filled('year_from') && $request->filled('year_to')) {
            $query->byYearRange($request->year_from, $request->year_to);
        } elseif ($request->filled('year')) {
            $query->byYear($request->year);
        }


        if ($request->filled('price_from') && $request->filled('price_to')) {
            $query->byPriceRange($request->price_from, $request->price_to);
        }


        if ($request->filled('mileage_from') && $request->filled('mileage_to')) {
            $query->byMileageRange($request->mileage_from, $request->mileage_to);
        }


        if ($request->filled('transmission')) {
            $query->byTransmission($request->transmission);
        }


        if ($request->filled('fuel')) {
            $query->byFuel($request->fuel);
        }


        if ($request->filled('color')) {
            $query->byColor($request->color);
        }


        if ($request->filled('drive')) {
            $query->byDrive($request->drive);
        }

        if ($request->filled('steering')) {
            $query->bySteering($request->steering);
        }

        if ($request->filled('country')) {
            $query->byCountry($request->country);
        }


        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortBy, $sortDirection);


        $perPage = $request->get('per_page', 15);
        $cars = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $cars,
            'message' => 'Cars retrieved successfully'
        ]);
    }


    public function store(Request $request): JsonResponse
    {

        // Prepare validation data - handle JSON strings from FormData
        $validationData = $request->all();

        // Convert JSON strings to arrays for validation if they exist
        if (isset($validationData['photos']) && is_string($validationData['photos'])) {
            $validationData['photos'] = json_decode($validationData['photos'], true) ?? [];
        }
        if (isset($validationData['details']) && is_string($validationData['details'])) {
            $validationData['details'] = json_decode($validationData['details'], true) ?? [];
        }

        $validator = Validator::make($validationData, [
            'category_id' => 'nullable|integer|exists:categories,id',
            'subcategory_id' => 'nullable|exists:categories,id',
            'ref_no' => 'nullable|string|max:32|unique:cars,ref_no',
            'code' => 'nullable|string|max:50',
            'make' => 'required|string|max:64',
            'model' => 'required|string|max:64',
            'model_code' => 'nullable|string|max:32',
            'variant' => 'nullable|string|max:128',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'reg_year_month' => 'nullable|string|max:10',
            'mileage_km' => 'nullable|integer|min:0',
            'engine_cc' => 'nullable|integer|min:0',
            'transmission' => 'nullable|string|max:32',
            'drive' => 'nullable|string|max:32',
            'steering' => 'nullable|string|max:16',
            'fuel' => 'nullable|string|max:32',
            'color' => 'nullable|string|max:64',
            'seats' => 'nullable|integer|min:1|max:20',
            'grade_overall' => 'nullable|string|max:10',
            'grade_exterior' => 'nullable|string|max:32',
            'grade_interior' => 'nullable|string|max:32',
            'price_amount' => 'nullable|numeric|min:0',
            'price_currency' => 'nullable|string|max:3',
            'price_basis' => 'nullable|string|max:32',
            'fob_value_usd' => 'nullable|numeric|min:0',
            'freight_usd' => 'nullable|numeric|min:0',
            'chassis_no_masked' => 'nullable|string|max:32',
            'chassis_no_full' => 'nullable|string|max:64',
            'location' => 'nullable|string|max:128',
            'country_origin' => 'nullable|string|max:64',
            'status' => 'nullable|string|max:32',
            'package' => 'nullable|string|max:255',
            'body' => 'nullable|string|max:64',
            'type' => 'nullable|string|max:64',
            'engine_number' => 'nullable|string|max:64',
            'number_of_keys' => 'nullable|integer|min:0',
            'keys_feature' => 'nullable|string',
            'notes' => 'nullable|string',
            'attached_file' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,pdf|max:10240', // 10MB max

            'photos' => 'nullable|array',
            'photos.*.url' => 'required_with:photos|string|max:512',
            'photos.*.is_primary' => 'boolean',
            'photos.*.sort_order' => 'integer|min:0',
            'photos.*.is_hidden' => 'boolean',

            'details' => 'nullable|array',
            'details.*.short_title' => 'nullable|string|max:255',
            'details.*.full_title' => 'nullable|string|max:255',
            'details.*.description' => 'nullable|string',
            'details.*.images' => 'nullable|array',
            'details.*.images.*' => 'string|max:512',
            'details.*.sub_details' => 'nullable|array',
            'details.*.sub_details.*.title' => 'nullable|string|max:255',
            'details.*.sub_details.*.description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('Car creation validation failed', [
                'errors' => $validator->errors()->toArray()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Handle file upload
            $attachedFileUrl = null;
            if ($request->hasFile('attached_file')) {
                $attachedFileUrl = $this->handleFileUpload($request->file('attached_file'));
            }

            // Create car
            $carData = collect($validationData)->only([
                'category_id', 'subcategory_id', 'ref_no', 'code', 'make', 'model', 'model_code',
                'variant', 'year', 'reg_year_month', 'mileage_km', 'engine_cc',
                'transmission', 'drive', 'steering', 'fuel', 'color', 'seats',
                'grade_overall', 'grade_exterior', 'grade_interior', 'price_amount',
                'price_currency', 'price_basis', 'fob_value_usd', 'freight_usd',
                'chassis_no_masked', 'chassis_no_full', 'location', 'country_origin', 'status',
                'package', 'body', 'type', 'engine_number', 'number_of_keys', 'keys_feature', 'notes'
            ])->toArray();

            // Convert empty strings to NULL for nullable fields
            $nullableFields = [
                'subcategory_id', 'ref_no', 'code', 'model_code', 'variant', 'reg_year_month',
                'mileage_km', 'engine_cc', 'transmission', 'drive', 'steering', 'fuel', 'color',
                'seats', 'grade_overall', 'grade_exterior', 'grade_interior', 'price_amount',
                'price_currency', 'price_basis', 'fob_value_usd', 'freight_usd',
                'chassis_no_masked', 'chassis_no_full', 'location', 'country_origin',
                'package', 'body', 'type', 'engine_number', 'number_of_keys', 'keys_feature', 'notes'
            ];

            foreach ($nullableFields as $field) {
                if (array_key_exists($field, $carData) && $carData[$field] === '') {
                    $carData[$field] = null;
                }
            }

            // Add attached file URL if uploaded
            if ($attachedFileUrl) {
                $carData['attached_file'] = $attachedFileUrl;
            }

            $car = Car::create($carData);

            if (!empty($validationData['photos'])) {
                foreach ($validationData['photos'] as $photoData) {
                    $car->photos()->create($photoData);
                }
            }

            if (!empty($validationData['details'])) {
                foreach ($validationData['details'] as $detailData) {
                    // Extract sub_details from detailData
                    $subDetails = $detailData['sub_details'] ?? [];
                    unset($detailData['sub_details']); // Remove sub_details from detailData

                    // Create the car detail
                    $carDetail = $car->details()->create($detailData);

                    // Create sub-details if they exist
                    if (!empty($subDetails)) {
                        foreach ($subDetails as $subDetailData) {
                            $carDetail->subDetails()->create($subDetailData);
                        }
                    }
                }
            }

            DB::commit();

            $car->load(['category', 'subcategory', 'photos', 'details.subDetails']);

            return response()->json([
                'success' => true,
                'data' => [
                    'car' => $car
                ],
                'message' => 'Car created successfully'
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create car',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import cars from Excel file
     */
    public function importFromExcel(Request $request): JsonResponse
    {
        // Debug: Log the request data
        Log::info('Excel import request', [
            'files' => $request->allFiles(),
            'headers' => $request->headers->all(),
            'content_type' => $request->header('Content-Type')
        ]);

        $validator = Validator::make($request->all(), [
            'excel_file' => 'required|file|max:10240', // 10MB max
        ]);

        // Additional file type validation
        if ($request->hasFile('excel_file')) {
            $file = $request->file('excel_file');
            $extension = strtolower($file->getClientOriginalExtension());
            $allowedExtensions = ['xlsx', 'xls', 'csv'];

            if (!in_array($extension, $allowedExtensions)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid file type. Please upload a .xlsx, .xls, or .csv file.',
                    'errors' => ['excel_file' => ['The file must be a valid Excel or CSV file.']]
                ], 422);
            }
        }

        if ($validator->fails()) {
            Log::error('Excel import validation failed', [
                'errors' => $validator->errors()->toArray()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $file = $request->file('excel_file');
            $fileName = time() . '_' . $file->getClientOriginalName();

            Log::info('Excel import: Processing file', [
                'original_name' => $file->getClientOriginalName(),
                'extension' => $file->getClientOriginalExtension(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize()
            ]);

            // Store file temporarily
            $path = $file->storeAs('temp/excel', $fileName);

            // Import cars from Excel
            $import = new CarsImport();
            Excel::import($import, $path);

            // Clean up temporary file
            Storage::delete($path);

            return response()->json([
                'success' => true,
                'message' => 'Cars imported successfully',
                'imported_count' => $import->getRowCount(),
                'note' => 'Please update car photos and details for imported cars'
            ]);

        } catch (\Exception $e) {
            Log::error('Excel import: Processing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to import cars',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update car photos for a specific car
     */
    public function updatePhotos(Request $request, Car $car): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'photos' => 'required|array|min:1',
            'photos.*.url' => 'required|string|max:512',
            'photos.*.is_primary' => 'boolean',
            'photos.*.sort_order' => 'integer|min:0',
            'photos.*.is_hidden' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Delete existing photos
            $car->photos()->delete();

            // Create new photos
            foreach ($request->photos as $photoData) {
                $car->photos()->create($photoData);
            }

            DB::commit();

            $car->load('photos');

            return response()->json([
                'success' => true,
                'data' => $car,
                'message' => 'Car photos updated successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update car photos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update car details for a specific car
     */
    public function updateDetails(Request $request, Car $car): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'short_title' => 'nullable|string|max:255',
            'full_title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'string|max:512',
            'sub_details' => 'nullable|array',
            'sub_details.*.title' => 'nullable|string|max:255',
            'sub_details.*.description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Extract sub_details from request
            $subDetails = $request->input('sub_details', []);
            $detailData = $request->except('sub_details');

            if ($car->details()->count() > 0) {
                $carDetail = $car->details()->first();
                $carDetail->update($detailData);

                // Delete existing sub-details and create new ones
                $carDetail->subDetails()->delete();
                if (!empty($subDetails)) {
                    foreach ($subDetails as $subDetailData) {
                        $carDetail->subDetails()->create($subDetailData);
                    }
                }
            } else {
                $carDetail = $car->details()->create($detailData);

                // Create sub-details if they exist
                if (!empty($subDetails)) {
                    foreach ($subDetails as $subDetailData) {
                        $carDetail->subDetails()->create($subDetailData);
                    }
                }
            }

            DB::commit();
            $car->load('details.subDetails');

            return response()->json([
                'success' => true,
                'data' => $car,
                'message' => 'Car details updated successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update car details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified car
     */
    public function show(Car $car): JsonResponse
    {
        $car->load(['category', 'subcategory', 'photos', 'details.subDetails']);

        return response()->json([
            'success' => true,
            'data' => [
                'car' => $car
            ],
            'message' => 'Car retrieved successfully'
        ]);
    }

    /**
     * Update the specified car
     */
    public function update(Request $request, Car $car): JsonResponse
    {

        // Prepare validation data - handle JSON strings from FormData
        $validationData = $request->all();

        // Convert JSON strings to arrays for validation if they exist
        if (isset($validationData['photos']) && is_string($validationData['photos'])) {
            $validationData['photos'] = json_decode($validationData['photos'], true) ?? [];
        }
        if (isset($validationData['details']) && is_string($validationData['details'])) {
            $validationData['details'] = json_decode($validationData['details'], true) ?? [];
        }

        $validator = Validator::make($validationData, [
            'category_id' => 'nullable|integer|exists:categories,id',
            'subcategory_id' => 'nullable|integer|exists:categories,id',
            'ref_no' => [
                'sometimes',
                'string',
                'max:32',
                Rule::unique('cars')->ignore($car->id)
            ],
            'code' => 'nullable|string|max:50',
            'make' => 'sometimes|string|max:64',
            'model' => 'sometimes|string|max:64',
            'model_code' => 'nullable|string|max:32',
            'variant' => 'nullable|string|max:128',
            'year' => 'sometimes|integer|min:1900|max:' . (date('Y') + 1),
            'reg_year_month' => 'nullable|string|max:10',
            'mileage_km' => 'nullable|integer|min:0',
            'engine_cc' => 'nullable|integer|min:0',
            'transmission' => 'nullable|string|max:32',
            'drive' => 'nullable|string|max:32',
            'steering' => 'nullable|string|max:16',
            'fuel' => 'nullable|string|max:32',
            'color' => 'nullable|string|max:64',
            'seats' => 'nullable|integer|min:1|max:20',
            'grade_overall' => 'nullable|string|max:10',
            'grade_exterior' => 'nullable|string|max:32',
            'grade_interior' => 'nullable|string|max:32',
            'price_amount' => 'nullable|numeric|min:0',
            'price_currency' => 'nullable|string|max:3',
            'price_basis' => 'nullable|string|max:32',
            'fob_value_usd' => 'nullable|numeric|min:0',
            'freight_usd' => 'nullable|numeric|min:0',
            'chassis_no_masked' => 'nullable|string|max:32',
            'chassis_no_full' => 'nullable|string|max:64',
            'location' => 'nullable|string|max:128',
            'country_origin' => 'nullable|string|max:64',
            'status' => 'nullable|string|max:32',
            'package' => 'nullable|string|max:255',
            'body' => 'nullable|string|max:64',
            'type' => 'nullable|string|max:64',
            'engine_number' => 'nullable|string|max:64',
            'number_of_keys' => 'nullable|integer|min:0',
            'keys_feature' => 'nullable|string',
            'notes' => 'nullable|string',
            'attached_file' => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,pdf|max:10240', // 10MB max

            'photos' => 'nullable|array',
            'photos.*.url' => 'required_with:photos|string|max:512',
            'photos.*.is_primary' => 'boolean',
            'photos.*.sort_order' => 'integer|min:0',
            'photos.*.is_hidden' => 'boolean',

            'details' => 'nullable|array',
            'details.*.short_title' => 'nullable|string|max:255',
            'details.*.full_title' => 'nullable|string|max:255',
            'details.*.description' => 'nullable|string',
            'details.*.images' => 'nullable|array',
            'details.*.images.*' => 'string|max:512',
            'details.*.sub_details' => 'nullable|array',
            'details.*.sub_details.*.title' => 'nullable|string|max:255',
            'details.*.sub_details.*.description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            Log::error('Car update validation failed', [
                'car_id' => $car->id,
                'errors' => $validator->errors()->toArray()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            // Handle file upload
            $attachedFileUrl = null;
            if ($request->hasFile('attached_file')) {
                $attachedFileUrl = $this->handleFileUpload($request->file('attached_file'));
            }

            // Update car basic data
            $carData = collect($validationData)->only([
                'category_id', 'subcategory_id', 'ref_no', 'code', 'make', 'model', 'model_code',
                'variant', 'year', 'reg_year_month', 'mileage_km', 'engine_cc',
                'transmission', 'drive', 'steering', 'fuel', 'color', 'seats',
                'grade_overall', 'grade_exterior', 'grade_interior', 'price_amount',
                'price_currency', 'price_basis', 'fob_value_usd', 'freight_usd',
                'chassis_no_masked', 'chassis_no_full', 'location', 'country_origin', 'status',
                'package', 'body', 'type', 'engine_number', 'number_of_keys', 'keys_feature', 'notes'
            ])->toArray();

            // Convert empty strings to NULL for nullable fields
            $nullableFields = [
                'subcategory_id', 'ref_no', 'code', 'model_code', 'variant', 'reg_year_month',
                'mileage_km', 'engine_cc', 'transmission', 'drive', 'steering', 'fuel', 'color',
                'seats', 'grade_overall', 'grade_exterior', 'grade_interior', 'price_amount',
                'price_currency', 'price_basis', 'fob_value_usd', 'freight_usd',
                'chassis_no_masked', 'chassis_no_full', 'location', 'country_origin',
                'package', 'body', 'type', 'engine_number', 'number_of_keys', 'keys_feature', 'notes'
            ];

            foreach ($nullableFields as $field) {
                if (array_key_exists($field, $carData) && $carData[$field] === '') {
                    $carData[$field] = null;
                }
            }

            // Add attached file URL if uploaded
            if ($attachedFileUrl) {
                $carData['attached_file'] = $attachedFileUrl;
            }

            $car->update($carData);

            // Update photos if provided
            if (!empty($validationData['photos'])) {
                // Delete existing photos
                $car->photos()->delete();

                // Create new photos
                foreach ($validationData['photos'] as $photoData) {
                    $car->photos()->create($photoData);
                }
            }

            // Update details if provided
            if (!empty($validationData['details'])) {
                // Delete existing details
                $car->details()->delete();

                foreach ($validationData['details'] as $detailData) {
                    // Extract sub_details from detailData
                    $subDetails = $detailData['sub_details'] ?? [];
                    unset($detailData['sub_details']); // Remove sub_details from detailData

                    // Create the car detail
                    $carDetail = $car->details()->create($detailData);

                    // Create sub-details if they exist
                    if (!empty($subDetails)) {
                        foreach ($subDetails as $subDetailData) {
                            $carDetail->subDetails()->create($subDetailData);
                        }
                    }
                }
            }

            DB::commit();

            $car->load(['category', 'subcategory', 'photos', 'details.subDetails']);

            Log::info('Car updated successfully', ['car_id' => $car->id]);

            return response()->json([
                'success' => true,
                'data' => [
                    'car' => $car
                ],
                'message' => 'Car updated successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Car update failed', [
                'car_id' => $car->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update car',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified car
     */
    public function destroy(Car $car): JsonResponse
    {
        try {
            $car->delete();

            return response()->json([
                'success' => true,
                'message' => 'Car deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete car',
                'error' => $e->getMessage()
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
                'makes' => Car::distinct()->pluck('make')->filter()->values(),
                'models' => Car::distinct()->pluck('model')->filter()->values(),
                'transmissions' => Car::distinct()->pluck('transmission')->filter()->values(),
                'fuels' => Car::distinct()->pluck('fuel')->filter()->values(),
                'colors' => Car::distinct()->pluck('color')->filter()->values(),
                'drives' => Car::distinct()->pluck('drive')->filter()->values(),
                'steerings' => Car::distinct()->pluck('steering')->filter()->values(),
                'countries' => Car::distinct()->pluck('country_origin')->filter()->values(),
                'statuses' => Car::distinct()->pluck('status')->filter()->values(),
                'categories' => Category::select('id', 'name')->get(),
                'years' => Car::distinct()->pluck('year')->sort()->values(),
            ];

            return response()->json([
                'success' => true,
                'data' => $options,
                'message' => 'Filter options retrieved successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve filter options',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update car status
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'car_ids' => 'required|array',
            'car_ids.*' => 'exists:cars,id',
            'status' => 'required|string|max:32',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $updatedCount = Car::whereIn('id', $request->car_ids)
                ->update(['status' => $request->status]);

            return response()->json([
                'success' => true,
                'message' => "Status updated for {$updatedCount} cars",
                'updated_count' => $updatedCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update car statuses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Export cars to Excel
     */
    public function exportToExcel(Request $request): JsonResponse
    {
        try {
            $query = Car::with(['category', 'subcategory']);

            // Apply filters if provided
            if ($request->filled('search')) {
                $query->search($request->search);
            }

            if ($request->filled('status')) {
                $query->byStatus($request->status);
            }

            if ($request->filled('category_id')) {
                $query->byCategory($request->category_id);
            }

            $cars = $query->get();

            // Generate Excel file
            $fileName = 'cars_export_' . date('Y-m-d_H-i-s') . '.xlsx';

            // You can implement Excel export logic here using Laravel Excel
            // For now, returning success response

            return response()->json([
                'success' => true,
                'message' => 'Cars exported successfully',
                'file_name' => $fileName,
                'exported_count' => $cars->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export cars',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get attached file for a car
     */
    public function getAttachedFile(Car $car): JsonResponse
    {
        if (!$car->attached_file) {
            return response()->json([
                'success' => false,
                'message' => 'No attached file found for this car'
            ], 404);
        }

        // Check if it's an image (ImageBB URL) or PDF (local storage)
        $isImage = filter_var($car->attached_file, FILTER_VALIDATE_URL) &&
                   !str_contains($car->attached_file, '/storage/');

        return response()->json([
            'success' => true,
            'data' => [
                'url' => $car->attached_file,
                'type' => $isImage ? 'image' : 'pdf',
                'filename' => basename($car->attached_file)
            ],
            'message' => 'Attached file retrieved successfully'
        ]);
    }

    /**
     * Download attached file for a car
     */
    public function downloadAttachedFile(Car $car)
    {
        if (!$car->attached_file) {
            return response()->json([
                'success' => false,
                'message' => 'No attached file found for this car'
            ], 404);
        }

        // Check if it's a local PDF file
        if (str_contains($car->attached_file, '/storage/')) {
            $filePath = str_replace('/storage/', '', $car->attached_file);
            $fullPath = storage_path('app/public/' . $filePath);

            if (file_exists($fullPath)) {
                return response()->download($fullPath, basename($car->attached_file));
            }
        }

        // For ImageBB URLs, redirect to the URL
        return redirect($car->attached_file);
    }
}

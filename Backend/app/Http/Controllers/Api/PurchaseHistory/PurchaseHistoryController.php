<?php

namespace App\Http\Controllers\Api\PurchaseHistory;

use App\Http\Controllers\Controller;
use App\Models\PurchaseHistory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class PurchaseHistoryController extends Controller
{
    /**
     * Handle PDF file upload using move method
     */
    private function handlePdfUpload($file, $fieldName)
    {
        if (!$file) {
            return null;
        }

        // Validate it's a PDF
        if ($file->getClientOriginalExtension() !== 'pdf') {
            return null;
        }

        // Create directory if it doesn't exist
        $uploadDir = public_path('purchase_history_pdfs');
        if (!File::exists($uploadDir)) {
            File::makeDirectory($uploadDir, 0755, true);
        }

        // Generate unique filename
        $filename = time() . '_' . $fieldName . '_' . $file->getClientOriginalName();

        // Move file to public folder
        $file->move($uploadDir, $filename);

        // Return relative path from public folder
        return '/purchase_history_pdfs/' . $filename;
    }

    /**
     * Delete old PDF file if exists
     */
    private function deleteOldPdf($filePath)
    {
        if ($filePath) {
            $fullPath = public_path($filePath);
            if (File::exists($fullPath)) {
                File::delete($fullPath);
            }
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = PurchaseHistory::with('car');

            // Search functionality
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('lc_number', 'like', "%{$search}%")
                      ->orWhere('invoice_number', 'like', "%{$search}%")
                      ->orWhere('lc_bank_name', 'like', "%{$search}%");
                });
            }

            // Filter by date range
            if ($request->filled('purchase_date_from')) {
                $query->where('purchase_date', '>=', $request->purchase_date_from);
            }

            if ($request->filled('purchase_date_to')) {
                $query->where('purchase_date', '<=', $request->purchase_date_to);
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $purchaseHistories = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $purchaseHistories,
                'message' => 'Purchase histories retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve purchase histories: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->merge([
                'car_id' => $request->input('car_id') !== null && $request->input('car_id') !== ''
                    ? $request->input('car_id')
                    : null,
            ]);

            $validator = Validator::make($request->all(), [
                'car_id' => 'nullable|exists:cars,id',
                'purchase_date' => 'nullable|date',
                'purchase_amount' => 'nullable|numeric',
                'govt_duty' => 'nullable|string',
                'cnf_amount' => 'nullable|numeric',
                'miscellaneous' => 'nullable|string',
                'lc_date' => 'nullable|date',
                'lc_number' => 'nullable|string',
                'lc_bank_name' => 'nullable|string',
                'lc_bank_branch_name' => 'nullable|string',
                'lc_bank_branch_address' => 'nullable|string',
                'total_units_per_lc' => 'nullable|string',
                'bill_of_lading' => 'nullable|file|mimes:pdf|max:10240',
                'invoice_number' => 'nullable|file|mimes:pdf|max:10240',
                'export_certificate' => 'nullable|file|mimes:pdf|max:10240',
                'export_certificate_translated' => 'nullable|file|mimes:pdf|max:10240',
                'bill_of_exchange_amount' => 'nullable|file|mimes:pdf|max:10240',
                'custom_duty_copy_3pages' => 'nullable|file|mimes:pdf|max:10240',
                'cheque_copy' => 'nullable|file|mimes:pdf|max:10240',
                'certificate' => 'nullable|file|mimes:pdf|max:10240',
                'custom_one' => 'nullable|file|mimes:pdf|max:10240',
                'custom_two' => 'nullable|file|mimes:pdf|max:10240',
                'custom_three' => 'nullable|file|mimes:pdf|max:10240',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only([
                'car_id',
                'purchase_date',
                'purchase_amount',
                'govt_duty',
                'cnf_amount',
                'miscellaneous',
                'lc_date',
                'lc_number',
                'lc_bank_name',
                'lc_bank_branch_name',
                'lc_bank_branch_address',
                'total_units_per_lc',
            ]);

            // Handle PDF file uploads
            $pdfFields = [
                'bill_of_lading',
                'invoice_number',
                'export_certificate',
                'export_certificate_translated',
                'bill_of_exchange_amount',
                'custom_duty_copy_3pages',
                'cheque_copy',
                'certificate',
                'custom_one',
                'custom_two',
                'custom_three',
            ];

            foreach ($pdfFields as $field) {
                if ($request->hasFile($field)) {
                    $data[$field] = $this->handlePdfUpload($request->file($field), $field);
                }
            }

            $purchaseHistory = PurchaseHistory::create($data)->load('car');

            return response()->json([
                'success' => true,
                'data' => $purchaseHistory,
                'message' => 'Purchase history created successfully'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create purchase history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $purchaseHistory = PurchaseHistory::with('car')->find($id);

            if (!$purchaseHistory) {
                return response()->json([
                    'success' => false,
                    'message' => 'Purchase history not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $purchaseHistory,
                'message' => 'Purchase history retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve purchase history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $purchaseHistory = PurchaseHistory::find($id);

            if (!$purchaseHistory) {
                return response()->json([
                    'success' => false,
                    'message' => 'Purchase history not found'
                ], 404);
            }

            $request->merge([
                'car_id' => $request->input('car_id') !== null && $request->input('car_id') !== ''
                    ? $request->input('car_id')
                    : null,
            ]);

            $validator = Validator::make($request->all(), [
                'car_id' => 'nullable|exists:cars,id',
                'purchase_date' => 'nullable|date',
                'purchase_amount' => 'nullable|numeric',
                'govt_duty' => 'nullable|string',
                'cnf_amount' => 'nullable|numeric',
                'miscellaneous' => 'nullable|string',
                'lc_date' => 'nullable|date',
                'lc_number' => 'nullable|string',
                'lc_bank_name' => 'nullable|string',
                'lc_bank_branch_name' => 'nullable|string',
                'lc_bank_branch_address' => 'nullable|string',
                'total_units_per_lc' => 'nullable|string',
                'bill_of_lading' => 'nullable|file|mimes:pdf|max:10240',
                'invoice_number' => 'nullable|file|mimes:pdf|max:10240',
                'export_certificate' => 'nullable|file|mimes:pdf|max:10240',
                'export_certificate_translated' => 'nullable|file|mimes:pdf|max:10240',
                'bill_of_exchange_amount' => 'nullable|file|mimes:pdf|max:10240',
                'custom_duty_copy_3pages' => 'nullable|file|mimes:pdf|max:10240',
                'cheque_copy' => 'nullable|file|mimes:pdf|max:10240',
                'certificate' => 'nullable|file|mimes:pdf|max:10240',
                'custom_one' => 'nullable|file|mimes:pdf|max:10240',
                'custom_two' => 'nullable|file|mimes:pdf|max:10240',
                'custom_three' => 'nullable|file|mimes:pdf|max:10240',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->only([
                'car_id',
                'purchase_date',
                'purchase_amount',
                'govt_duty',
                'cnf_amount',
                'miscellaneous',
                'lc_date',
                'lc_number',
                'lc_bank_name',
                'lc_bank_branch_name',
                'lc_bank_branch_address',
                'total_units_per_lc',
            ]);

            // Handle PDF file uploads
            $pdfFields = [
                'bill_of_lading',
                'invoice_number',
                'export_certificate',
                'export_certificate_translated',
                'bill_of_exchange_amount',
                'custom_duty_copy_3pages',
                'cheque_copy',
                'certificate',
                'custom_one',
                'custom_two',
                'custom_three',
            ];

            foreach ($pdfFields as $field) {
                if ($request->hasFile($field)) {
                    // Delete old file if exists
                    $this->deleteOldPdf($purchaseHistory->$field);
                    // Upload new file
                    $data[$field] = $this->handlePdfUpload($request->file($field), $field);
                }
            }

            $purchaseHistory->update($data);

            return response()->json([
                'success' => true,
                'data' => $purchaseHistory->fresh()->load('car'),
                'message' => 'Purchase history updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $purchaseHistory = PurchaseHistory::find($id);

            if (!$purchaseHistory) {
                return response()->json([
                    'success' => false,
                    'message' => 'Purchase history not found'
                ], 404);
            }

            // Delete all associated PDF files
            $pdfFields = [
                'bill_of_lading',
                'invoice_number',
                'export_certificate',
                'export_certificate_translated',
                'bill_of_exchange_amount',
                'custom_duty_copy_3pages',
                'cheque_copy',
                'certificate',
                'custom_one',
                'custom_two',
                'custom_three',
            ];

            foreach ($pdfFields as $field) {
                $this->deleteOldPdf($purchaseHistory->$field);
            }

            $purchaseHistory->delete();

            return response()->json([
                'success' => true,
                'message' => 'Purchase history deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete purchase history: ' . $e->getMessage()
            ], 500);
        }
    }
}

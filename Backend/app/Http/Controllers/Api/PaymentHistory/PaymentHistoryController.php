<?php

namespace App\Http\Controllers\Api\PaymentHistory;

use App\Http\Controllers\Controller;
use App\Models\PaymentHistory;
use App\Models\Installment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PaymentHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = PaymentHistory::with(['car', 'installments']);

            // Search functionality
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('showroom_name', 'like', "%{$search}%")
                      ->orWhere('nid_number', 'like', "%{$search}%")
                      ->orWhere('customer_name', 'like', "%{$search}%")
                      ->orWhere('contact_number', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('tin_certificate', 'like', "%{$search}%");
                });
            }

            // Filter by car_id
            if ($request->filled('car_id')) {
                $query->where('car_id', $request->car_id);
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
            $paymentHistories = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $paymentHistories,
                'message' => 'Payment histories retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment histories: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'car_id' => 'nullable|exists:cars,id',
                'showroom_name' => 'nullable|string|max:255',
                'wholesaler_address' => 'nullable|string',
                'purchase_amount' => 'nullable|numeric|min:0',
                'purchase_date' => 'nullable|date',
                'nid_number' => 'nullable|string|max:255',
                'customer_name' => 'nullable|string|max:255',
                'tin_certificate' => 'nullable|string|max:255',
                'customer_address' => 'nullable|string',
                'contact_number' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'installments' => 'nullable|array',
                'installments.*.installment_date' => 'nullable|date',
                'installments.*.description' => 'nullable|string',
                'installments.*.amount' => 'nullable|numeric|min:0',
                'installments.*.payment_method' => 'nullable|in:Bank,Cash',
                'installments.*.bank_name' => 'nullable|string|max:255',
                'installments.*.cheque_number' => 'nullable|string|max:255',
                'installments.*.balance' => 'nullable|numeric',
                'installments.*.remarks' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            try {
                $data = $request->only([
                    'car_id',
                    'showroom_name',
                    'wholesaler_address',
                    'purchase_amount',
                    'purchase_date',
                    'nid_number',
                    'customer_name',
                    'tin_certificate',
                    'customer_address',
                    'contact_number',
                    'email',
                ]);

                $paymentHistory = PaymentHistory::create($data);

                // Create installments if provided
                if ($request->has('installments') && is_array($request->installments)) {
                    foreach ($request->installments as $installmentData) {
                        $installmentData['payment_history_id'] = $paymentHistory->id;
                        Installment::create($installmentData);
                    }
                }

                DB::commit();

                // Load relationships
                $paymentHistory->load(['car', 'installments']);

                return response()->json([
                    'success' => true,
                    'data' => $paymentHistory,
                    'message' => 'Payment history created successfully'
                ], 201);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $paymentHistory = PaymentHistory::with(['car', 'installments'])->find($id);

            if (!$paymentHistory) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment history not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $paymentHistory,
                'message' => 'Payment history retrieved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve payment history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $paymentHistory = PaymentHistory::find($id);

            if (!$paymentHistory) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment history not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'car_id' => 'nullable|exists:cars,id',
                'showroom_name' => 'nullable|string|max:255',
                'wholesaler_address' => 'nullable|string',
                'purchase_amount' => 'nullable|numeric|min:0',
                'purchase_date' => 'nullable|date',
                'nid_number' => 'nullable|string|max:255',
                'customer_name' => 'nullable|string|max:255',
                'tin_certificate' => 'nullable|string|max:255',
                'customer_address' => 'nullable|string',
                'contact_number' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'installments' => 'nullable|array',
                'installments.*.id' => 'nullable|exists:installments,id',
                'installments.*.installment_date' => 'nullable|date',
                'installments.*.description' => 'nullable|string',
                'installments.*.amount' => 'nullable|numeric|min:0',
                'installments.*.payment_method' => 'nullable|in:Bank,Cash',
                'installments.*.bank_name' => 'nullable|string|max:255',
                'installments.*.cheque_number' => 'nullable|string|max:255',
                'installments.*.balance' => 'nullable|numeric',
                'installments.*.remarks' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            try {
                $data = $request->only([
                    'car_id',
                    'showroom_name',
                    'wholesaler_address',
                    'purchase_amount',
                    'purchase_date',
                    'nid_number',
                    'customer_name',
                    'tin_certificate',
                    'customer_address',
                    'contact_number',
                    'email',
                ]);

                $paymentHistory->update($data);

                // Handle installments update
                if ($request->has('installments')) {
                    // Get existing installment IDs from request
                    $existingIds = collect($request->installments)
                        ->pluck('id')
                        ->filter()
                        ->toArray();

                    // Delete installments that are not in the request
                    $paymentHistory->installments()
                        ->whereNotIn('id', $existingIds)
                        ->delete();

                    // Update or create installments
                    foreach ($request->installments as $installmentData) {
                        if (isset($installmentData['id'])) {
                            // Update existing installment
                            $installment = Installment::where('id', $installmentData['id'])
                                ->where('payment_history_id', $paymentHistory->id)
                                ->first();

                            if ($installment) {
                                unset($installmentData['id']);
                                $installment->update($installmentData);
                            }
                        } else {
                            // Create new installment
                            $installmentData['payment_history_id'] = $paymentHistory->id;
                            Installment::create($installmentData);
                        }
                    }
                }

                DB::commit();

                // Load relationships
                $paymentHistory->load(['car', 'installments']);

                return response()->json([
                    'success' => true,
                    'data' => $paymentHistory->fresh(['car', 'installments']),
                    'message' => 'Payment history updated successfully'
                ]);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment history: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $paymentHistory = PaymentHistory::find($id);

            if (!$paymentHistory) {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment history not found'
                ], 404);
            }

            // Installments will be deleted automatically due to cascade delete
            $paymentHistory->delete();

            return response()->json([
                'success' => true,
                'message' => 'Payment history deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payment history: ' . $e->getMessage()
            ], 500);
        }
    }
}

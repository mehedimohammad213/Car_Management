<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    /**
     * Generate and download invoice for an order
     */
    public function downloadInvoice($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $order = Order::with(['items.car', 'user'])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Check if user can access this order
        if ($user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        try {
            // Generate invoice data
            $invoiceData = [
                'order' => $order,
                'company' => [
                    'name' => 'Car Management System',
                    'address' => '123 Business Street, City, State 12345',
                    'phone' => '+1 (555) 123-4567',
                    'email' => 'info@carmanagement.com',
                    'website' => 'www.carmanagement.com'
                ],
                'invoice_number' => 'INV-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                'invoice_date' => now()->format('M d, Y'),
                'due_date' => now()->addDays(30)->format('M d, Y'),
            ];

            // Generate PDF
            $pdf = Pdf::loadView('invoices.invoice', $invoiceData);
            $pdf->setPaper('A4', 'portrait');
            
            $filename = 'Invoice-' . $invoiceData['invoice_number'] . '.pdf';
            
            return $pdf->download($filename);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate invoice: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate and download invoice for an order (Admin only)
     */
    public function downloadInvoiceAdmin($id)
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $order = Order::with(['items.car', 'user'])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        try {
            // Generate invoice data
            $invoiceData = [
                'order' => $order,
                'company' => [
                    'name' => 'Car Management System',
                    'address' => '123 Business Street, City, State 12345',
                    'phone' => '+1 (555) 123-4567',
                    'email' => 'info@carmanagement.com',
                    'website' => 'www.carmanagement.com'
                ],
                'invoice_number' => 'INV-' . str_pad($order->id, 6, '0', STR_PAD_LEFT),
                'invoice_date' => now()->format('M d, Y'),
                'due_date' => now()->addDays(30)->format('M d, Y'),
            ];

            // Generate PDF
            $pdf = Pdf::loadView('invoices.invoice', $invoiceData);
            $pdf->setPaper('A4', 'portrait');
            
            $filename = 'Invoice-' . $invoiceData['invoice_number'] . '.pdf';
            
            return $pdf->download($filename);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate invoice: ' . $e->getMessage()
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Create a new order from cart items
     */
    public function createOrder(Request $request)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        // Validate request
        $request->validate([
            'shipping_address' => 'nullable|string|max:500'
        ]);

        try {
            DB::beginTransaction();

            // Get user's cart items
            $cartItems = Cart::where('user_id', $user->id)
                ->with('car')
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cart is empty'
                ], 400);
            }

            // Calculate total amount
            $totalAmount = 0;
            foreach ($cartItems as $cartItem) {
                $totalAmount += $cartItem->car->price_amount * $cartItem->quantity;
            }

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'shipping_address' => $request->shipping_address,
                'status' => 'pending'
            ]);

            // Create order items from cart items
            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'car_id' => $cartItem->car_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->car->price_amount,
                    'notes' => null
                ]);
            }

            // Clear cart after successful order creation
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            // Load order with relationships
            $order->load(['items.car', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => [
                    'order' => $order
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's orders
     */
    public function getUserOrders()
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $orders = Order::where('user_id', $user->id)
            ->with(['items.car'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $orders
            ]
        ]);
    }

    /**
     * Get all orders (Admin only)
     */
    public function getAllOrders()
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $orders = Order::with(['items.car', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'orders' => $orders
            ]
        ]);
    }

    /**
     * Get single order details
     */
    public function getOrder($id)
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

        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order
            ]
        ]);
    }

    /**
     * Update order status (Admin only)
     */
    public function updateOrderStatus(Request $request, $id)
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $request->validate([
            'status' => ['required', Rule::in(['pending', 'approved', 'shipped', 'delivered', 'canceled'])]
        ]);

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        $order->update([
            'status' => $request->status
        ]);

        $order->load(['items.car', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Order status updated successfully',
            'data' => [
                'order' => $order
            ]
        ]);
    }

    /**
     * Cancel order (User only, if status is pending)
     */
    public function cancelOrder($id)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }

        $order = Order::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Order cannot be canceled. Only pending orders can be canceled.'
            ], 400);
        }

        $order->update([
            'status' => 'canceled'
        ]);

        $order->load(['items.car']);

        return response()->json([
            'success' => true,
            'message' => 'Order canceled successfully',
            'data' => [
                'order' => $order
            ]
        ]);
    }

    /**
     * Delete order (Admin only)
     */
    public function deleteOrder($id)
    {
        $user = Auth::user();
        
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Delete order items first (due to foreign key constraint)
        $order->items()->delete();
        $order->delete();

        return response()->json([
            'success' => true,
            'message' => 'Order deleted successfully'
        ]);
    }
}

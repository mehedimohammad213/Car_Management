<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Car;
use App\Models\Stock;
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
                if (!$cartItem->car->price_amount) {
                    throw new \Exception("Car with ID {$cartItem->car_id} does not have a valid price. Cannot create order.");
                }
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
                // Ensure car has a valid price
                if (!$cartItem->car->price_amount) {
                    throw new \Exception("Car with ID {$cartItem->car_id} does not have a valid price. Cannot create order.");
                }

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

        $order = Order::with(['items.car'])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        try {
            DB::beginTransaction();

            // If status is being changed to 'delivered', reduce stock
            if ($request->status === 'delivered' && $order->status !== 'delivered') {
                $this->reduceStockForOrder($order);
            }

            // Update order status
            $order->update([
                'status' => $request->status
            ]);

            DB::commit();

            $order->load(['items.car', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Order status updated successfully',
                'data' => [
                    'order' => $order
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update order status: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reduce stock when order is delivered
     */
    private function reduceStockForOrder(Order $order)
    {
        foreach ($order->items as $orderItem) {
            $stock = Stock::where('car_id', $orderItem->car_id)->first();

            if (!$stock) {
                throw new \Exception("Stock not found for car ID: {$orderItem->car_id}");
            }

            if ($stock->quantity < $orderItem->quantity) {
                throw new \Exception("Insufficient stock for car ID: {$orderItem->car_id}. Available: {$stock->quantity}, Required: {$orderItem->quantity}");
            }

            // Reduce stock quantity
            $newQuantity = $stock->quantity - $orderItem->quantity;
            $stock->update(['quantity' => $newQuantity]);

            // Update stock status to 'sold' if quantity becomes 0
            if ($newQuantity === 0) {
                $stock->update(['status' => 'sold']);

                // Also update car status to 'sold'
                if ($stock->car) {
                    $stock->car->update(['status' => 'sold']);
                }
            }
        }
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

        $order = Order::with(['items.car'])->where('id', $id)
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
     * Admin cancel order with stock restoration (if delivered)
     */
    public function adminCancelOrder(Request $request, $id)
    {
        $user = Auth::user();

        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized access'
            ], 403);
        }

        $order = Order::with(['items.car'])->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        if ($order->status === 'canceled') {
            return response()->json([
                'success' => false,
                'message' => 'Order is already canceled'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // If order was delivered, restore stock
            if ($order->status === 'delivered') {
                $this->restoreStockForOrder($order);
            }

            // Update order status to canceled
            $order->update([
                'status' => 'canceled'
            ]);

            DB::commit();

            $order->load(['items.car', 'user']);

            return response()->json([
                'success' => true,
                'message' => 'Order canceled successfully',
                'data' => [
                    'order' => $order
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore stock when order is canceled after delivery
     */
    private function restoreStockForOrder(Order $order)
    {
        foreach ($order->items as $orderItem) {
            $stock = Stock::where('car_id', $orderItem->car_id)->first();

            if ($stock) {
                // Restore stock quantity
                $newQuantity = $stock->quantity + $orderItem->quantity;
                $stock->update(['quantity' => $newQuantity]);

                // Update stock status back to 'available' if it was 'sold'
                if ($stock->status === 'sold') {
                    $stock->update(['status' => 'available']);

                    // Also update car status back to 'available'
                    if ($stock->car) {
                        $stock->car->update(['status' => 'available']);
                    }
                }
            }
        }
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

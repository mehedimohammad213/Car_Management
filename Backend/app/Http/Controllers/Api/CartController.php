<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CartController extends Controller
{
    /**
     * Get user's cart items
     */
    public function index(): JsonResponse
    {
        try {
            $user = Auth::user();
            $cartItems = Cart::with(['car.category', 'car.primaryPhoto'])
                ->where('user_id', $user->id)
                ->get();

            $total = 0;
            $cartItems->each(function ($item) use (&$total) {
                if ($item->car->price_amount) {
                    $total += $item->car->price_amount * $item->quantity;
                }
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'items' => $cartItems,
                    'total' => $total,
                    'count' => $cartItems->count()
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cart items',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Add item to cart
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'car_id' => 'required|exists:cars,id',
                'quantity' => 'required|integer|min:1|max:10'
            ]);

            $user = Auth::user();
            $car = Car::findOrFail($request->car_id);

            // Check if car is available
            if ($car->status !== 'available') {
                return response()->json([
                    'success' => false,
                    'message' => 'This car is not available for purchase'
                ], 400);
            }

            // Check if car has a valid price
            if (!$car->price_amount || $car->price_amount <= 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'This car does not have a valid price and cannot be added to cart'
                ], 400);
            }

            // Check if item already exists in cart
            $existingCartItem = Cart::where('user_id', $user->id)
                ->where('car_id', $request->car_id)
                ->first();

            if ($existingCartItem) {
                // Update quantity
                $existingCartItem->quantity += $request->quantity;
                $existingCartItem->save();

                $cartItem = $existingCartItem;
            } else {
                // Create new cart item
                $cartItem = Cart::create([
                    'user_id' => $user->id,
                    'car_id' => $request->car_id,
                    'quantity' => $request->quantity
                ]);
            }

            $cartItem->load(['car.category', 'car.primaryPhoto']);

            return response()->json([
                'success' => true,
                'message' => 'Item added to cart successfully',
                'data' => $cartItem
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add item to cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update cart item quantity
     */
    public function update(Request $request, Cart $cart): JsonResponse
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1|max:10'
            ]);

            $user = Auth::user();

            // Check if cart item belongs to user
            if ($cart->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to cart item'
                ], 403);
            }

            $cart->update(['quantity' => $request->quantity]);
            $cart->load(['car.category', 'car.primaryPhoto']);

            return response()->json([
                'success' => true,
                'message' => 'Cart item updated successfully',
                'data' => $cart
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cart item',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove item from cart
     */
    public function destroy(Cart $cart): JsonResponse
    {
        try {
            $user = Auth::user();

            // Check if cart item belongs to user
            if ($cart->user_id !== $user->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized access to cart item'
                ], 403);
            }

            $cart->delete();

            return response()->json([
                'success' => true,
                'message' => 'Item removed from cart successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove item from cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear entire cart
     */
    public function clear(): JsonResponse
    {
        try {
            $user = Auth::user();

            Cart::where('user_id', $user->id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Cart cleared successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cart',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get cart summary (count and total)
     */
    public function summary(): JsonResponse
    {
        try {
            $user = Auth::user();

            $cartItems = Cart::with('car')
                ->where('user_id', $user->id)
                ->get();

            $total = 0;
            $count = 0;

            $cartItems->each(function ($item) use (&$total, &$count) {
                if ($item->car->price_amount) {
                    $total += $item->car->price_amount * $item->quantity;
                }
                $count += $item->quantity;
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'count' => $count,
                    'total' => $total,
                    'items_count' => $cartItems->count()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get cart summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
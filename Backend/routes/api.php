<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Car\CarController;
use App\Http\Controllers\Api\Stock\StockController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;

// Auth routes (no middleware)
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{id}', [CategoryController::class, 'destroy']);
    Route::get('/parent/list', [CategoryController::class, 'getParentCategories']);
    Route::get('/stats/overview', [CategoryController::class, 'getStats']);
});
// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::get('/auth/users', [AuthController::class, 'getAllUsers']);

    // Category API Routes


    // Car API Routes
    Route::prefix('cars')->group(function () {
        // Main CRUD operations
        Route::get('/', [CarController::class, 'index']);
        Route::post('/', [CarController::class, 'store']);
        Route::get('/{car}', [CarController::class, 'show']);
        Route::post('/{car}/update', [CarController::class, 'update']);
        Route::delete('/{car}', [CarController::class, 'destroy']);

        // Excel import/export
        Route::post('/import/excel', [CarController::class, 'importFromExcel']);
        Route::get('/export/excel', [CarController::class, 'exportToExcel']);

        // Photos and details management
        Route::put('/{car}/photos', [CarController::class, 'updatePhotos']);
        Route::put('/{car}/details', [CarController::class, 'updateDetails']);

        // Bulk operations
        Route::put('/bulk/status', [CarController::class, 'bulkUpdateStatus']);

        // Additional endpoints
        Route::get('/filter/options', [CarController::class, 'getFilterOptions']);
        
        // File serving routes
        Route::get('/{car}/attached-file', [CarController::class, 'getAttachedFile']);
        Route::get('/{car}/attached-file/download', [CarController::class, 'downloadAttachedFile']);
    });

    // Cart API Routes
    Route::prefix('cart')->group(function () {
        Route::get('/', [CartController::class, 'index']);
        Route::post('/', [CartController::class, 'store']);
        Route::put('/{cart}', [CartController::class, 'update']);
        Route::delete('/{cart}', [CartController::class, 'destroy']);
        Route::delete('/clear', [CartController::class, 'clear']);
        Route::get('/summary', [CartController::class, 'summary']);
    });

    // Order API Routes
    Route::prefix('orders')->group(function () {
        Route::post('/', [OrderController::class, 'createOrder']);
        Route::get('/user', [OrderController::class, 'getUserOrders']);
        Route::get('/{id}', [OrderController::class, 'getOrder']);
        Route::put('/{id}/cancel', [OrderController::class, 'cancelOrder']);
        
        // Admin only routes
        Route::get('/admin/all', [OrderController::class, 'getAllOrders']);
        Route::put('/{id}/status', [OrderController::class, 'updateOrderStatus']);
        Route::delete('/{id}', [OrderController::class, 'deleteOrder']);
    });
});


// Stock API Routes
Route::prefix('stocks')->group(function () {
    Route::get('/', [StockController::class, 'index']);
    Route::post('/', [StockController::class, 'store']);
    Route::get('/{stock}', [StockController::class, 'show']);
    Route::put('/{stock}', [StockController::class, 'update']);
    Route::delete('/{stock}', [StockController::class, 'destroy']);
    Route::get('/stats/overview', [StockController::class, 'statistics']);
    Route::put('/bulk/status', [StockController::class, 'bulkUpdateStatus']);
    Route::get('/available/cars', [StockController::class, 'getAvailableCars']);
});

<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Car\CarController;
use App\Http\Controllers\Api\Stock\StockController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PurchaseHistory\PurchaseHistoryController;
use App\Http\Controllers\Api\PaymentHistory\PaymentHistoryController;

// Public routes (no middleware)
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/categories/parent/list', [CategoryController::class, 'getParentCategories']);

Route::get('/cars', [CarController::class, 'index']);
Route::get('/cars/{car}', [CarController::class, 'show']);
Route::get('/cars/filter/options', [CarController::class, 'getFilterOptions']);

Route::get('/stocks', [StockController::class, 'index']);
Route::get('/stocks/{stock}', [StockController::class, 'show']);
Route::get('/stocks/stats/overview', [StockController::class, 'statistics']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::get('/auth/users', [AuthController::class, 'getAllUsers']);

    // Category API Routes
    Route::prefix('categories')->group(function () {
        Route::post('/', [CategoryController::class, 'store']);
        Route::put('/{id}', [CategoryController::class, 'update']);
        Route::delete('/{id}', [CategoryController::class, 'destroy']);
        Route::get('/stats/overview', [CategoryController::class, 'getStats']);
    });

    // Car API Routes
    Route::prefix('cars')->group(function () {
        // Main CRUD operations
        Route::post('/', [CarController::class, 'store']);
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

    // Purchase History API Routes
    Route::prefix('purchase-history')->group(function () {
        Route::get('/', [PurchaseHistoryController::class, 'index']);
        Route::post('/', [PurchaseHistoryController::class, 'store']);
        Route::get('/{id}/pdf/download', [PurchaseHistoryController::class, 'downloadPdf'])->name('purchase-history.pdf.download');
        Route::get('/{id}', [PurchaseHistoryController::class, 'show']);
        Route::put('/{id}', [PurchaseHistoryController::class, 'update']);
        Route::delete('/{id}', [PurchaseHistoryController::class, 'destroy']);
    });

    // Payment History API Routes
    Route::prefix('payment-history')->group(function () {
        Route::get('/', [PaymentHistoryController::class, 'index']);
        Route::post('/', [PaymentHistoryController::class, 'store']);
        Route::get('/{id}', [PaymentHistoryController::class, 'show']);
        Route::put('/{id}', [PaymentHistoryController::class, 'update']);
        Route::delete('/{id}', [PaymentHistoryController::class, 'destroy']);
    });

    // Stock API Routes (Protected)
    Route::prefix('stocks')->group(function () {
        Route::post('/', [StockController::class, 'store']);
        Route::put('/{stock}', [StockController::class, 'update']);
        Route::delete('/{stock}', [StockController::class, 'destroy']);
        Route::put('/bulk/status', [StockController::class, 'bulkUpdateStatus']);
        Route::get('/available/cars', [StockController::class, 'getAvailableCars']);
    });
});


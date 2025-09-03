<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Car\CarController;
use App\Http\Controllers\Api\Stock\StockController;
use App\Http\Controllers\Api\AuthController;

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

    // Category API Routes


    // Car API Routes
    Route::prefix('cars')->group(function () {
        // Main CRUD operations
        Route::get('/', [CarController::class, 'index']);
        Route::post('/', [CarController::class, 'store']);
        Route::get('/{car}', [CarController::class, 'show']);
        Route::put('/{car}', [CarController::class, 'update']);
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

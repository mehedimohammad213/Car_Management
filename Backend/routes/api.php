<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Category\CategoryController;
use App\Http\Controllers\Api\Car\CarController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Category API Routes
Route::prefix('categories')->group(function () {
    // Main CRUD operations
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{id}', [CategoryController::class, 'destroy']);
    
    // Additional endpoints
    Route::get('/parent/list', [CategoryController::class, 'getParentCategories']);
    Route::get('/stats/overview', [CategoryController::class, 'getStats']);
});

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

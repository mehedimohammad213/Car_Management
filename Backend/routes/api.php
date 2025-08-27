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
    Route::get('/{id}', [CarController::class, 'show']);
    Route::put('/{id}', [CarController::class, 'update']);
    Route::delete('/{id}', [CarController::class, 'destroy']);
    
    // Additional endpoints
    Route::get('/stats/overview', [CarController::class, 'getStats']);
    Route::get('/filter/options', [CarController::class, 'getFilterOptions']);
});

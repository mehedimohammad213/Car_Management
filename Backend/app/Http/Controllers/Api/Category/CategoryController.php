<?php

namespace App\Http\Controllers\Api\Category;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories with search, filter, and pagination
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Category::with(['parent', 'children']);

            // Search functionality
            if ($request->has('search') && !empty($request->search)) {
                $query->search($request->search);
            }

            // Filter by status
            if ($request->has('status') && in_array($request->status, ['active', 'inactive'])) {
                $query->where('status', $request->status);
            }

            // Filter by parent/child categories
            if ($request->has('type')) {
                if ($request->type === 'parent') {
                    $query->parentCategories();
                } elseif ($request->type === 'child') {
                    $query->childCategories();
                }
            }

            // Filter by parent category
            if ($request->has('parent_id')) {
                if ($request->parent_id === 'null') {
                    $query->whereNull('parent_category_id');
                } else {
                    $query->where('parent_category_id', $request->parent_id);
                }
            }

            // Sort functionality
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $allowedSortFields = ['id', 'name', 'status', 'created_at', 'updated_at'];
            
            if (in_array($sortBy, $allowedSortFields)) {
                $query->orderBy($sortBy, $sortOrder);
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $perPage = min(max($perPage, 1), 100); // Limit between 1 and 100

            $categories = $query->paginate($perPage);

            // Transform data for response
            $data = $categories->getCollection()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'image' => $category->image_url,
                    'parent_category_id' => $category->parent_category_id,
                    'parent_category' => $category->parent ? [
                        'id' => $category->parent->id,
                        'name' => $category->parent->name
                    ] : null,
                    'status' => $category->status,
                    'short_des' => $category->short_des,
                    'full_name' => $category->full_name,
                    'children_count' => $category->children->count(),
                    'cars_count' => $category->cars->count(),
                    'created_at' => $category->created_at->toISOString(),
                    'updated_at' => $category->updated_at->toISOString(),
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully',
                'status_code' => 200,
                'data' => [
                    'categories' => $data,
                    'pagination' => [
                        'current_page' => $categories->currentPage(),
                        'last_page' => $categories->lastPage(),
                        'per_page' => $categories->perPage(),
                        'total' => $categories->total(),
                        'from' => $categories->firstItem(),
                        'to' => $categories->lastItem(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve categories: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Store a newly created category
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255|unique:categories,name',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'parent_category_id' => 'nullable|exists:categories,id',
                'status' => 'nullable|in:active,inactive',
                'short_des' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'status_code' => 422,
                    'data' => [
                        'errors' => $validator->errors()
                    ]
                ], 422);
            }

            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('categories', 'public');
                $data['image'] = $imagePath;
            }

            $category = Category::create($data);

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'status_code' => 201,
                'data' => [
                    'category' => [
                        'id' => $category->id,
                        'name' => $category->name,
                        'image' => $category->image_url,
                        'parent_category_id' => $category->parent_category_id,
                        'status' => $category->status,
                        'short_des' => $category->short_des,
                        'full_name' => $category->full_name,
                        'created_at' => $category->created_at->toISOString(),
                        'updated_at' => $category->updated_at->toISOString(),
                    ]
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Display the specified category
     */
    public function show($id): JsonResponse
    {
        try {
            $category = Category::with(['parent', 'children', 'cars'])->find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found',
                    'status_code' => 404,
                    'data' => []
                ], 404);
            }

            return response()->json([
                'success' => true,
                'message' => 'Category retrieved successfully',
                'status_code' => 200,
                'data' => [
                    'category' => [
                        'id' => $category->id,
                        'name' => $category->name,
                        'image' => $category->image_url,
                        'parent_category_id' => $category->parent_category_id,
                        'parent_category' => $category->parent ? [
                            'id' => $category->parent->id,
                            'name' => $category->parent->name
                        ] : null,
                        'status' => $category->status,
                        'short_des' => $category->short_des,
                        'full_name' => $category->full_name,
                        'children' => $category->children->map(function ($child) {
                            return [
                                'id' => $child->id,
                                'name' => $child->name,
                                'status' => $child->status,
                                'cars_count' => $child->cars->count(),
                            ];
                        }),
                        'children_count' => $category->children->count(),
                        'cars_count' => $category->cars->count(),
                        'created_at' => $category->created_at->toISOString(),
                        'updated_at' => $category->updated_at->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve category: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Update the specified category
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $category = Category::find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found',
                    'status_code' => 404,
                    'data' => []
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => ['required', 'string', 'max:255', Rule::unique('categories')->ignore($id)],
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'parent_category_id' => [
                    'nullable',
                    'exists:categories,id',
                    function ($attribute, $value, $fail) use ($id) {
                        if ($value == $id) {
                            $fail('A category cannot be its own parent.');
                        }
                    }
                ],
                'status' => 'nullable|in:active,inactive',
                'short_des' => 'nullable|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'status_code' => 422,
                    'data' => [
                        'errors' => $validator->errors()
                    ]
                ], 422);
            }

            $data = $validator->validated();

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($category->image) {
                    Storage::disk('public')->delete($category->image);
                }
                
                $imagePath = $request->file('image')->store('categories', 'public');
                $data['image'] = $imagePath;
            }

            $category->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'status_code' => 200,
                'data' => [
                    'category' => [
                        'id' => $category->id,
                        'name' => $category->name,
                        'image' => $category->image_url,
                        'parent_category_id' => $category->parent_category_id,
                        'status' => $category->status,
                        'short_des' => $category->short_des,
                        'full_name' => $category->full_name,
                        'created_at' => $category->created_at->toISOString(),
                        'updated_at' => $category->updated_at->toISOString(),
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Remove the specified category
     */
    public function destroy($id): JsonResponse
    {
        try {
            $category = Category::find($id);

            if (!$category) {
                return response()->json([
                    'success' => false,
                    'message' => 'Category not found',
                    'status_code' => 404,
                    'data' => []
                ], 404);
            }

            // Check if category has children
            if ($category->children()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category with subcategories',
                    'status_code' => 400,
                    'data' => []
                ], 400);
            }

            // Check if category has cars
            if ($category->cars()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category with associated cars',
                    'status_code' => 400,
                    'data' => []
                ], 400);
            }

            // Delete image if exists
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully',
                'status_code' => 200,
                'data' => []
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Get all parent categories for dropdown
     */
    public function getParentCategories(): JsonResponse
    {
        try {
            $parentCategories = Category::parentCategories()
                ->active()
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Parent categories retrieved successfully',
                'status_code' => 200,
                'data' => [
                    'parent_categories' => $parentCategories
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve parent categories: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }

    /**
     * Get category statistics
     */
    public function getStats(): JsonResponse
    {
        try {
            $stats = [
                'total_categories' => Category::count(),
                'active_categories' => Category::active()->count(),
                'inactive_categories' => Category::inactive()->count(),
                'parent_categories' => Category::parentCategories()->count(),
                'child_categories' => Category::childCategories()->count(),
            ];

            return response()->json([
                'success' => true,
                'message' => 'Category statistics retrieved successfully',
                'status_code' => 200,
                'data' => [
                    'statistics' => $stats
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve category statistics: ' . $e->getMessage(),
                'status_code' => 500,
                'data' => []
            ], 500);
        }
    }
}

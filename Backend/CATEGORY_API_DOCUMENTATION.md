# Category API Documentation

This document provides comprehensive information about the Category API endpoints, including request/response formats, parameters, and examples.

## Base URL
```
http://your-domain.com/api/categories
```

## Response Format
All API responses follow a consistent JSON format:

```json
{
    "success": true/false,
    "message": "Success or error message",
    "status_code": 200/201/400/404/422/500,
    "data": {
        // Response data here
    }
}
```

## Endpoints

### 1. Get All Categories (with Search, Filter, and Pagination)

**Endpoint:** `GET /api/categories`

**Description:** Retrieve all categories with optional search, filtering, and pagination.

**Query Parameters:**
- `search` (string, optional): Search in name and description
- `status` (string, optional): Filter by status ('active' or 'inactive')
- `type` (string, optional): Filter by type ('parent' or 'child')
- `parent_id` (integer|string, optional): Filter by parent category ID (use 'null' for parent categories)
- `sort_by` (string, optional): Sort field ('id', 'name', 'status', 'created_at', 'updated_at')
- `sort_order` (string, optional): Sort order ('asc' or 'desc')
- `per_page` (integer, optional): Items per page (1-100, default: 15)

**Example Request:**
```
GET /api/categories?search=car&status=active&sort_by=name&sort_order=asc&per_page=10
```

**Example Response:**
```json
{
    "success": true,
    "message": "Categories retrieved successfully",
    "status_code": 200,
    "data": {
        "categories": [
            {
                "id": 1,
                "name": "Sports Cars",
                "image": "http://your-domain.com/storage/categories/sports-car.jpg",
                "parent_category_id": null,
                "parent_category": null,
                "status": "active",
                "short_des": "High-performance sports vehicles",
                "full_name": "Sports Cars",
                "children_count": 3,
                "cars_count": 15,
                "created_at": "2025-08-27T10:00:00.000000Z",
                "updated_at": "2025-08-27T10:00:00.000000Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "last_page": 5,
            "per_page": 10,
            "total": 50,
            "from": 1,
            "to": 10
        }
    }
}
```

### 2. Create New Category

**Endpoint:** `POST /api/categories`

**Description:** Create a new category.

**Request Body (multipart/form-data):**
```json
{
    "name": "string (required, max:255, unique)",
    "image": "file (optional, image, max:2MB)",
    "parent_category_id": "integer (optional, must exist)",
    "status": "string (optional, 'active' or 'inactive')",
    "short_des": "string (optional, max:500)"
}
```

**Example Request:**
```json
{
    "name": "Electric Vehicles",
    "parent_category_id": 1,
    "status": "active",
    "short_des": "Environmentally friendly electric cars"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Category created successfully",
    "status_code": 201,
    "data": {
        "category": {
            "id": 2,
            "name": "Electric Vehicles",
            "image": null,
            "parent_category_id": 1,
            "status": "active",
            "short_des": "Environmentally friendly electric cars",
            "full_name": "Sports Cars > Electric Vehicles",
            "created_at": "2025-08-27T10:30:00.000000Z",
            "updated_at": "2025-08-27T10:30:00.000000Z"
        }
    }
}
```

### 3. Get Single Category

**Endpoint:** `GET /api/categories/{id}`

**Description:** Retrieve a specific category by ID with its relationships.

**Example Request:**
```
GET /api/categories/1
```

**Example Response:**
```json
{
    "success": true,
    "message": "Category retrieved successfully",
    "status_code": 200,
    "data": {
        "category": {
            "id": 1,
            "name": "Sports Cars",
            "image": "http://your-domain.com/storage/categories/sports-car.jpg",
            "parent_category_id": null,
            "parent_category": null,
            "status": "active",
            "short_des": "High-performance sports vehicles",
            "full_name": "Sports Cars",
            "children": [
                {
                    "id": 2,
                    "name": "Electric Vehicles",
                    "status": "active",
                    "cars_count": 8
                }
            ],
            "children_count": 1,
            "cars_count": 15,
            "created_at": "2025-08-27T10:00:00.000000Z",
            "updated_at": "2025-08-27T10:00:00.000000Z"
        }
    }
}
```

### 4. Update Category

**Endpoint:** `PUT /api/categories/{id}`

**Description:** Update an existing category.

**Request Body (multipart/form-data):**
```json
{
    "name": "string (required, max:255, unique except current)",
    "image": "file (optional, image, max:2MB)",
    "parent_category_id": "integer (optional, must exist, cannot be self)",
    "status": "string (optional, 'active' or 'inactive')",
    "short_des": "string (optional, max:500)"
}
```

**Example Request:**
```json
{
    "name": "Luxury Sports Cars",
    "status": "active",
    "short_des": "Premium high-performance sports vehicles"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Category updated successfully",
    "status_code": 200,
    "data": {
        "category": {
            "id": 1,
            "name": "Luxury Sports Cars",
            "image": "http://your-domain.com/storage/categories/sports-car.jpg",
            "parent_category_id": null,
            "status": "active",
            "short_des": "Premium high-performance sports vehicles",
            "full_name": "Luxury Sports Cars",
            "created_at": "2025-08-27T10:00:00.000000Z",
            "updated_at": "2025-08-27T11:00:00.000000Z"
        }
    }
}
```

### 5. Delete Category

**Endpoint:** `DELETE /api/categories/{id}`

**Description:** Delete a category (only if it has no children or associated cars).

**Example Request:**
```
DELETE /api/categories/3
```

**Example Response:**
```json
{
    "success": true,
    "message": "Category deleted successfully",
    "status_code": 200,
    "data": []
}
```

**Error Response (if category has children):**
```json
{
    "success": false,
    "message": "Cannot delete category with subcategories",
    "status_code": 400,
    "data": []
}
```

### 6. Get Parent Categories

**Endpoint:** `GET /api/categories/parent/list`

**Description:** Get all parent categories for dropdown selection.

**Example Request:**
```
GET /api/categories/parent/list
```

**Example Response:**
```json
{
    "success": true,
    "message": "Parent categories retrieved successfully",
    "status_code": 200,
    "data": {
        "parent_categories": [
            {
                "id": 1,
                "name": "Sports Cars"
            },
            {
                "id": 4,
                "name": "SUVs"
            }
        ]
    }
}
```

### 7. Get Category Statistics

**Endpoint:** `GET /api/categories/stats/overview`

**Description:** Get overview statistics for categories.

**Example Request:**
```
GET /api/categories/stats/overview
```

**Example Response:**
```json
{
    "success": true,
    "message": "Category statistics retrieved successfully",
    "status_code": 200,
    "data": {
        "statistics": {
            "total_categories": 25,
            "active_categories": 20,
            "inactive_categories": 5,
            "parent_categories": 8,
            "child_categories": 17
        }
    }
}
```

## Error Responses

### Validation Error (422)
```json
{
    "success": false,
    "message": "Validation failed",
    "status_code": 422,
    "data": {
        "errors": {
            "name": ["The name field is required."],
            "parent_category_id": ["The selected parent category id is invalid."]
        }
    }
}
```

### Not Found Error (404)
```json
{
    "success": false,
    "message": "Category not found",
    "status_code": 404,
    "data": []
}
```

### Server Error (500)
```json
{
    "success": false,
    "message": "Failed to retrieve categories: Database connection error",
    "status_code": 500,
    "data": []
}
```

## Search and Filter Examples

### Search by Name or Description
```
GET /api/categories?search=electric
```

### Filter by Status
```
GET /api/categories?status=active
```

### Filter by Type
```
GET /api/categories?type=parent
GET /api/categories?type=child
```

### Filter by Parent Category
```
GET /api/categories?parent_id=1
GET /api/categories?parent_id=null
```

### Sort Results
```
GET /api/categories?sort_by=name&sort_order=asc
GET /api/categories?sort_by=created_at&sort_order=desc
```

### Pagination
```
GET /api/categories?per_page=20&page=2
```

### Combined Filters
```
GET /api/categories?search=car&status=active&type=child&sort_by=name&sort_order=asc&per_page=10
```

## File Upload

When uploading images, use `multipart/form-data` content type:

```bash
curl -X POST http://your-domain.com/api/categories \
  -F "name=New Category" \
  -F "image=@/path/to/image.jpg" \
  -F "status=active" \
  -F "short_des=Category description"
```

## Notes

1. **Image Storage**: Images are stored in `storage/app/public/categories/` and accessible via `/storage/categories/` URL.
2. **Hierarchical Structure**: Categories support parent-child relationships for organizing content.
3. **Validation**: All inputs are validated server-side with appropriate error messages.
4. **Soft Constraints**: Categories with children or associated cars cannot be deleted.
5. **Search**: Searches are performed on both name and description fields using LIKE queries.
6. **Pagination**: Default page size is 15, maximum is 100 items per page.

# Stock Management API Documentation

## Overview
The Stock Management API provides comprehensive CRUD operations for managing car inventory stock, including filtering, search, and bulk operations.

## Base URL
```
http://localhost:8000/api/stocks
```

## Authentication
All endpoints require authentication via Laravel Sanctum. Include the Bearer token in the Authorization header:
```
Authorization: Bearer {your_token}
```

## Endpoints

### 1. Get All Stocks (with filtering and search)

**GET** `/api/stocks`

**Query Parameters:**
- `status` (optional): Filter by stock status
  - Values: `available`, `sold`, `reserved`, `damaged`, `lost`, `stolen`
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `min_quantity` (optional): Minimum quantity filter
- `max_quantity` (optional): Maximum quantity filter
- `search` (optional): Search in car make, model, or reference number
- `sort_by` (optional): Sort field (default: `created_at`)
- `sort_order` (optional): Sort direction `asc` or `desc` (default: `desc`)
- `per_page` (optional): Items per page (default: 15)

**Example Request:**
```bash
GET /api/stocks?status=available&min_price=10000&max_price=50000&search=toyota&sort_by=price&sort_order=asc&per_page=20
```

**Response:**
```json
{
  "success": true,
  "data": {
    "current_page": 1,
    "data": [
      {
        "id": 1,
        "car_id": 1,
        "quantity": 5,
        "price": "25000.00",
        "status": "available",
        "notes": "New arrival",
        "created_at": "2025-01-01T00:00:00.000000Z",
        "updated_at": "2025-01-01T00:00:00.000000Z",
        "car": {
          "id": 1,
          "make": "Toyota",
          "model": "Camry",
          "ref_no": "TOY001",
          "category": {
            "id": 1,
            "name": "Sedan"
          },
          "subcategory": {
            "id": 2,
            "name": "Mid-size"
          },
          "photos": []
        }
      }
    ],
    "total": 25,
    "per_page": 20,
    "last_page": 2
  },
  "message": "Stocks retrieved successfully"
}
```

### 2. Create New Stock

**POST** `/api/stocks`

**Request Body:**
```json
{
  "car_id": 1,
  "quantity": 5,
  "price": 25000.00,
  "status": "available",
  "notes": "New arrival from Japan"
}
```

**Validation Rules:**
- `car_id`: Required, must exist in cars table
- `quantity`: Required, integer, minimum 0
- `price`: Optional, numeric, minimum 0
- `status`: Required, must be one of: `available`, `sold`, `reserved`, `damaged`, `lost`, `stolen`
- `notes`: Optional, string, maximum 1000 characters

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "car_id": 1,
    "quantity": 5,
    "price": "25000.00",
    "status": "available",
    "notes": "New arrival from Japan",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  },
  "message": "Stock created successfully"
}
```

**Error Response (Car already has stock):**
```json
{
  "success": false,
  "message": "Stock already exists for this car. Use update instead."
}
```

### 3. Get Single Stock

**GET** `/api/stocks/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "car_id": 1,
    "quantity": 5,
    "price": "25000.00",
    "status": "available",
    "notes": "New arrival from Japan",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z",
    "car": {
      "id": 1,
      "make": "Toyota",
      "model": "Camry",
      "ref_no": "TOY001",
      "category": {...},
      "subcategory": {...},
      "photos": [...],
      "details": [...]
    }
  },
  "message": "Stock retrieved successfully"
}
```

### 4. Update Stock

**PUT** `/api/stocks/{id}`

**Request Body:**
```json
{
  "quantity": 3,
  "price": 23000.00,
  "status": "reserved",
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "car_id": 1,
    "quantity": 3,
    "price": "23000.00",
    "status": "reserved",
    "notes": "Updated notes",
    "updated_at": "2025-01-01T12:00:00.000000Z"
  },
  "message": "Stock updated successfully"
}
```

### 5. Delete Stock

**DELETE** `/api/stocks/{id}`

**Response:**
```json
{
  "success": true,
  "message": "Stock deleted successfully"
}
```

### 6. Get Stock Statistics

**GET** `/api/stocks/stats/overview`

**Response:**
```json
{
  "success": true,
  "data": {
    "total_stocks": 25,
    "total_quantity": 150,
    "total_value": 3750000.00,
    "by_status": [
      {
        "status": "available",
        "count": 15
      },
      {
        "status": "sold",
        "count": 8
      },
      {
        "status": "reserved",
        "count": 2
      }
    ],
    "by_category": [
      {
        "name": "Sedan",
        "count": 12
      },
      {
        "name": "SUV",
        "count": 8
      },
      {
        "name": "Hatchback",
        "count": 5
      }
    ]
  },
  "message": "Stock statistics retrieved successfully"
}
```

### 7. Bulk Update Stock Statuses

**PUT** `/api/stocks/bulk/status`

**Request Body:**
```json
{
  "stock_ids": [1, 2, 3],
  "status": "sold"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Stock statuses updated successfully",
  "updated_count": 3
}
```

### 8. Get Available Cars for Stock Creation

**GET** `/api/stocks/available/cars`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "make": "Honda",
      "model": "Civic",
      "ref_no": "HON001",
      "category": {...},
      "subcategory": {...},
      "photos": [...]
    }
  ],
  "message": "Available cars retrieved successfully"
}
```

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "car_id": ["The car id field is required."],
    "quantity": ["The quantity must be at least 0."]
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Failed to create stock",
  "error": "Database connection failed"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Stock not found"
}
```

## Stock Status Values

- `available`: Car is available for sale
- `sold`: Car has been sold
- `reserved`: Car is reserved for a customer
- `damaged`: Car is damaged and not available
- `lost`: Car is lost
- `stolen`: Car has been stolen

## Important Notes

1. **One-to-One Relationship**: Each car can only have one stock record
2. **Car Status Sync**: When stock status changes, the associated car's status is automatically updated
3. **Cascade Protection**: Deleting a stock will reset the car status to 'available'
4. **Search Functionality**: Search works across car make, model, and reference number
5. **Filtering**: Multiple filters can be combined for precise queries
6. **Pagination**: All list endpoints support pagination with customizable page sizes
7. **Sorting**: Results can be sorted by any field in ascending or descending order

## Rate Limiting

- Standard endpoints: 60 requests per minute
- Bulk operations: 10 requests per minute
- Statistics endpoints: 30 requests per minute

## Testing Examples

### cURL Examples

**Get all available stocks:**
```bash
curl -X GET "http://localhost:8000/api/stocks?status=available" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Create new stock:**
```bash
curl -X POST "http://localhost:8000/api/stocks" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "car_id": 1,
    "quantity": 5,
    "price": 25000.00,
    "status": "available",
    "notes": "New arrival"
  }'
```

**Update stock status:**
```bash
curl -X PUT "http://localhost:8000/api/stocks/1" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "sold"
  }'
```

**Delete stock:**
```bash
curl -X DELETE "http://localhost:8000/api/stocks/1" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

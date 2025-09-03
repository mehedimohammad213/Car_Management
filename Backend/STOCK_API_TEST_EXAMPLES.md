# Stock API Test Examples

## Prerequisites
1. Laravel backend running on `http://localhost:8000`
2. Authentication token (Bearer token)
3. Some cars already created in the database
4. Postman, cURL, or any API testing tool

## Test Data Setup

### 1. Create Test Cars First
Before testing stocks, ensure you have some cars in the database:

```bash
# Create a car first
curl -X POST "http://localhost:8000/api/cars" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "transmission": "Automatic",
    "fuel": "Gasoline",
    "color": "Silver"
  }'
```

## Stock API Testing

### 1. Create Stock

**Test Case: Create new stock for a car**
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
    "notes": "New arrival from Japan"
  }'
```

**Expected Response:**
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

**Test Case: Try to create stock for car that already has stock**
```bash
curl -X POST "http://localhost:8000/api/stocks" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "car_id": 1,
    "quantity": 3,
    "price": 23000.00,
    "status": "available",
    "notes": "Another stock"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Stock already exists for this car. Use update instead."
}
```

### 2. Get All Stocks

**Test Case: Get all stocks with pagination**
```bash
curl -X GET "http://localhost:8000/api/stocks" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Test Case: Filter by status**
```bash
curl -X GET "http://localhost:8000/api/stocks?status=available" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Test Case: Filter by price range**
```bash
curl -X GET "http://localhost:8000/api/stocks?min_price=20000&max_price=30000" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Test Case: Search by car make/model**
```bash
curl -X GET "http://localhost:8000/api/stocks?search=toyota" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Test Case: Combined filters with sorting**
```bash
curl -X GET "http://localhost:8000/api/stocks?status=available&min_price=20000&sort_by=price&sort_order=asc&per_page=10" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

### 3. Get Single Stock

**Test Case: Get stock by ID**
```bash
curl -X GET "http://localhost:8000/api/stocks/1" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Expected Response:**
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
      "photos": [...]
    }
  },
  "message": "Stock retrieved successfully"
}
```

### 4. Update Stock

**Test Case: Update stock quantity and price**
```bash
curl -X PUT "http://localhost:8000/api/stocks/1" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3,
    "price": 23000.00
  }'
```

**Test Case: Update stock status**
```bash
curl -X PUT "http://localhost:8000/api/stocks/1" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "reserved"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "car_id": 1,
    "quantity": 3,
    "price": "23000.00",
    "status": "reserved",
    "notes": "New arrival from Japan",
    "updated_at": "2025-01-01T12:00:00.000000Z"
  },
  "message": "Stock updated successfully"
}
```

### 5. Get Stock Statistics

**Test Case: Get overview statistics**
```bash
curl -X GET "http://localhost:8000/api/stocks/stats/overview" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "total_stocks": 1,
    "total_quantity": 3,
    "total_value": 69000.00,
    "by_status": [
      {
        "status": "reserved",
        "count": 1
      }
    ],
    "by_category": [
      {
        "name": "Sedan",
        "count": 1
      }
    ]
  },
  "message": "Stock statistics retrieved successfully"
}
```

### 6. Bulk Update Stock Statuses

**Test Case: Bulk update multiple stocks**
```bash
curl -X PUT "http://localhost:8000/api/stocks/bulk/status" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "stock_ids": [1, 2, 3],
    "status": "sold"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Stock statuses updated successfully",
  "updated_count": 3
}
```

### 7. Get Available Cars

**Test Case: Get cars available for stock creation**
```bash
curl -X GET "http://localhost:8000/api/stocks/available/cars" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
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

### 8. Delete Stock

**Test Case: Delete stock**
```bash
curl -X DELETE "http://localhost:8000/api/stocks/1" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Stock deleted successfully"
}
```

## Validation Testing

### 1. Invalid Car ID
```bash
curl -X POST "http://localhost:8000/api/stocks" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "car_id": 999,
    "quantity": 5,
    "status": "available"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "car_id": ["The selected car id is invalid."]
  }
}
```

### 2. Invalid Quantity
```bash
curl -X POST "http://localhost:8000/api/stocks" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "car_id": 1,
    "quantity": -5,
    "status": "available"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "quantity": ["The quantity must be at least 0."]
  }
}
```

### 3. Invalid Status
```bash
curl -X POST "http://localhost:8000/api/stocks" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "car_id": 1,
    "quantity": 5,
    "status": "invalid_status"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "status": ["The selected status is invalid."]
  }
}
```

## Error Testing

### 1. Unauthorized Access
```bash
curl -X GET "http://localhost:8000/api/stocks"
```

**Expected Response:**
```json
{
  "message": "Unauthenticated."
}
```

### 2. Stock Not Found
```bash
curl -X GET "http://localhost:8000/api/stocks/999" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Stock not found"
}
```

## Performance Testing

### 1. Large Dataset
```bash
# Test with large number of stocks
curl -X GET "http://localhost:8000/api/stocks?per_page=100" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

### 2. Complex Filtering
```bash
# Test with multiple filters
curl -X GET "http://localhost:8000/api/stocks?status=available&min_price=10000&max_price=50000&min_quantity=1&max_quantity=10&search=toyota&sort_by=price&sort_order=asc&per_page=50" \
  -H "Authorization: Bearer {your_token}" \
  -H "Accept: application/json"
```

## Postman Collection

You can import this collection into Postman for easier testing:

```json
{
  "info": {
    "name": "Stock Management API",
    "description": "Complete API testing for Stock management system"
  },
  "item": [
    {
      "name": "Create Stock",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"car_id\": 1,\n  \"quantity\": 5,\n  \"price\": 25000.00,\n  \"status\": \"available\",\n  \"notes\": \"New arrival\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/api/stocks",
          "host": ["{{base_url}}"],
          "path": ["api", "stocks"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    },
    {
      "key": "token",
      "value": "your_bearer_token_here"
    }
  ]
}
```

## Testing Checklist

- [ ] Create stock with valid data
- [ ] Create stock with invalid data (validation errors)
- [ ] Try to create duplicate stock for same car
- [ ] Get all stocks with pagination
- [ ] Filter stocks by status
- [ ] Filter stocks by price range
- [ ] Filter stocks by quantity range
- [ ] Search stocks by car make/model
- [ ] Sort stocks by different fields
- [ ] Get single stock details
- [ ] Update stock information
- [ ] Update stock status
- [ ] Get stock statistics
- [ ] Bulk update stock statuses
- [ ] Get available cars for stock creation
- [ ] Delete stock
- [ ] Test unauthorized access
- [ ] Test with non-existent stock ID
- [ ] Test performance with large datasets
- [ ] Test complex filtering combinations

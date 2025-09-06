# Car API Documentation

This document provides comprehensive information about the Car API endpoints, including request/response formats, parameters, and examples.

## Base URL
```
http://your-domain.com/api/cars
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

### 1. Get All Cars (with Search, Filter, and Pagination)

**Endpoint:** `GET /api/cars`

**Description:** Retrieve all cars with optional search, filtering, and pagination.

**Query Parameters:**
- `search` (string, optional): Search in ref_no, make, model, variant, model_code, chassis_no_masked, location, notes
- `status` (string, optional): Filter by status ('available', 'sold', 'reserved')
- `category_id` (integer, optional): Filter by category ID
- `subcategory_id` (integer, optional): Filter by subcategory ID
- `make` (string, optional): Filter by make
- `year` (integer, optional): Filter by specific year
- `year_from` (integer, optional): Filter by year range (minimum)
- `year_to` (integer, optional): Filter by year range (maximum)
- `price_from` (numeric, optional): Filter by price range (minimum)
- `price_to` (numeric, optional): Filter by price range (maximum)
- `mileage_from` (integer, optional): Filter by mileage range (minimum)
- `mileage_to` (integer, optional): Filter by mileage range (maximum)
- `transmission` (string, optional): Filter by transmission type
- `fuel` (string, optional): Filter by fuel type
- `color` (string, optional): Filter by color
- `drive` (string, optional): Filter by drive type
- `steering` (string, optional): Filter by steering position
- `country` (string, optional): Filter by country of origin
- `sort_by` (string, optional): Sort field ('id', 'ref_no', 'make', 'model', 'year', 'mileage_km', 'price_amount', 'status', 'created_at', 'updated_at')
- `sort_order` (string, optional): Sort order ('asc' or 'desc')
- `per_page` (integer, optional): Items per page (1-100, default: 15)

**Example Request:**
```
GET /api/cars?search=ferrari&status=available&year_from=2020&price_from=200000&sort_by=price_amount&sort_order=desc&per_page=10
```

**Example Response:**
```json
{
    "success": true,
    "message": "Cars retrieved successfully",
    "status_code": 200,
    "data": {
        "cars": [
            {
                "id": 1,
                "ref_no": "CAR-SPORTS-001",
                "make": "Ferrari",
                "model": "488",
                "model_code": "F488",
                "variant": "GTB",
                "full_name": "Ferrari 488 GTB",
                "year": 2020,
                "reg_year_month": "2020-03",
                "mileage_km": 15000,
                "formatted_mileage": "15,000 km",
                "engine_cc": 3902,
                "formatted_engine": "3,902 cc",
                "transmission": "Automatic",
                "drive": "RWD",
                "steering": "Right",
                "fuel": "Petrol",
                "color": "Red",
                "seats": 2,
                "grade_overall": 4.5,
                "grade_exterior": "A",
                "grade_interior": "A",
                "price_amount": 250000.00,
                "price_currency": "USD",
                "formatted_price": "USD 250,000.00",
                "price_basis": "FOB",
                "chassis_no_masked": "ZFF******G******",
                "location": "Tokyo, Japan",
                "country_origin": "Japan",
                "status": "available",
                "notes": "Excellent condition, low mileage sports car",
                "category": {
                    "id": 1,
                    "name": "Sports Cars"
                },
                "subcategory": null,
                "primary_photo_url": null,
                "photos_count": 0,
                "created_at": "2025-08-27T10:00:00.000000Z",
                "updated_at": "2025-08-27T10:00:00.000000Z"
            }
        ],
        "pagination": {
            "current_page": 1,
            "last_page": 1,
            "per_page": 10,
            "total": 1,
            "from": 1,
            "to": 1
        }
    }
}
```

### 2. Create New Car

**Endpoint:** `POST /api/cars`

**Description:** Create a new car.

**Request Body:**
```json
{
    "category_id": "integer (required, must exist)",
    "subcategory_id": "integer (optional, must exist)",
    "ref_no": "string (optional, max:32, unique)",
    "make": "string (required, max:64)",
    "model": "string (required, max:64)",
    "model_code": "string (optional, max:32)",
    "variant": "string (optional, max:128)",
    "year": "integer (required, min:1900, max:current_year+1)",
    "reg_year_month": "string (optional, max:7)",
    "mileage_km": "integer (optional, min:0)",
    "engine_cc": "integer (optional, min:0)",
    "transmission": "string (optional, max:32)",
    "drive": "string (optional, max:32)",
    "steering": "string (optional, max:16)",
    "fuel": "string (optional, max:32)",
    "color": "string (optional, max:64)",
    "seats": "integer (optional, min:1, max:20)",
    "grade_overall": "numeric (optional, min:0, max:5)",
    "grade_exterior": "string (optional, max:1)",
    "grade_interior": "string (optional, max:1)",
    "price_amount": "numeric (optional, min:0)",
    "price_currency": "string (optional, max:3)",
    "price_basis": "string (optional, max:32)",
    "chassis_no_masked": "string (optional, max:32)",
    "chassis_no_full": "string (optional, max:64)",
    "location": "string (optional, max:128)",
    "country_origin": "string (optional, max:64)",
    "status": "string (optional, max:32)",
    "notes": "string (optional)"
}
```

**Example Request:**
```json
{
    "category_id": 1,
    "make": "BMW",
    "model": "X5",
    "variant": "xDrive40i",
    "year": 2021,
    "mileage_km": 25000,
    "engine_cc": 2998,
    "transmission": "Automatic",
    "drive": "AWD",
    "steering": "Right",
    "fuel": "Petrol",
    "color": "Black",
    "seats": 5,
    "grade_overall": 4.5,
    "price_amount": 75000.00,
    "price_currency": "USD",
    "location": "Tokyo, Japan",
    "country_origin": "Japan",
    "status": "available",
    "notes": "Luxury SUV in excellent condition"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Car created successfully",
    "status_code": 201,
    "data": {
        "car": {
            "id": 12,
            "ref_no": "CAR-ABC123",
            "make": "BMW",
            "model": "X5",
            "full_name": "BMW X5 xDrive40i",
            "year": 2021,
            "status": "available",
            "created_at": "2025-08-27T12:00:00.000000Z",
            "updated_at": "2025-08-27T12:00:00.000000Z"
        }
    }
}
```

### 3. Get Single Car

**Endpoint:** `GET /api/cars/{id}`

**Description:** Retrieve a specific car by ID with its relationships.

**Example Request:**
```
GET /api/cars/1
```

**Example Response:**
```json
{
    "success": true,
    "message": "Car retrieved successfully",
    "status_code": 200,
    "data": {
        "car": {
            "id": 1,
            "ref_no": "CAR-SPORTS-001",
            "make": "Ferrari",
            "model": "488",
            "model_code": "F488",
            "variant": "GTB",
            "full_name": "Ferrari 488 GTB",
            "year": 2020,
            "reg_year_month": "2020-03",
            "mileage_km": 15000,
            "formatted_mileage": "15,000 km",
            "engine_cc": 3902,
            "formatted_engine": "3,902 cc",
            "transmission": "Automatic",
            "drive": "RWD",
            "steering": "Right",
            "fuel": "Petrol",
            "color": "Red",
            "seats": 2,
            "grade_overall": 4.5,
            "grade_exterior": "A",
            "grade_interior": "A",
            "price_amount": 250000.00,
            "price_currency": "USD",
            "formatted_price": "USD 250,000.00",
            "price_basis": "FOB",
            "chassis_no_masked": "ZFF******G******",
            "chassis_no_full": "ZFF67LFA0L0223456",
            "location": "Tokyo, Japan",
            "country_origin": "Japan",
            "status": "available",
            "notes": "Excellent condition, low mileage sports car",
            "category": {
                "id": 1,
                "name": "Sports Cars"
            },
            "subcategory": null,
            "photos": [
                {
                    "id": 1,
                    "image_url": "http://your-domain.com/storage/cars/ferrari-488-1.jpg",
                    "is_primary": true,
                    "caption": "Front view"
                }
            ],
            "photos_count": 1,
            "created_at": "2025-08-27T10:00:00.000000Z",
            "updated_at": "2025-08-27T10:00:00.000000Z"
        }
    }
}
```

### 4. Update Car

**Endpoint:** `PUT /api/cars/{id}`

**Description:** Update an existing car.

**Request Body:** Same as create, but all fields are optional except for required validation rules.

**Example Request:**
```json
{
    "price_amount": 240000.00,
    "status": "reserved",
    "notes": "Updated notes - car is now reserved"
}
```

**Example Response:**
```json
{
    "success": true,
    "message": "Car updated successfully",
    "status_code": 200,
    "data": {
        "car": {
            "id": 1,
            "ref_no": "CAR-SPORTS-001",
            "make": "Ferrari",
            "model": "488",
            "full_name": "Ferrari 488 GTB",
            "year": 2020,
            "status": "reserved",
            "created_at": "2025-08-27T10:00:00.000000Z",
            "updated_at": "2025-08-27T12:30:00.000000Z"
        }
    }
}
```

### 5. Delete Car

**Endpoint:** `DELETE /api/cars/{id}`

**Description:** Delete a car and its associated photos.

**Example Request:**
```
DELETE /api/cars/1
```

**Example Response:**
```json
{
    "success": true,
    "message": "Car deleted successfully",
    "status_code": 200,
    "data": []
}
```

### 6. Get Car Statistics

**Endpoint:** `GET /api/cars/stats/overview`

**Description:** Get overview statistics for cars.

**Example Request:**
```
GET /api/cars/stats/overview
```

**Example Response:**
```json
{
    "success": true,
    "message": "Car statistics retrieved successfully",
    "status_code": 200,
    "data": {
        "statistics": {
            "total_cars": 12,
            "available_cars": 8,
            "sold_cars": 1,
            "reserved_cars": 3,
            "cars_by_make": [
                {
                    "make": "Ferrari",
                    "count": 2
                },
                {
                    "make": "Toyota",
                    "count": 2
                }
            ],
            "cars_by_year": [
                {
                    "year": 2021,
                    "count": 5
                },
                {
                    "year": 2020,
                    "count": 4
                }
            ],
            "cars_by_status": [
                {
                    "status": "available",
                    "count": 8
                },
                {
                    "status": "reserved",
                    "count": 3
                },
                {
                    "status": "sold",
                    "count": 1
                }
            ]
        }
    }
}
```

### 7. Get Filter Options

**Endpoint:** `GET /api/cars/filter/options`

**Description:** Get all available filter options for cars.

**Example Request:**
```
GET /api/cars/filter/options
```

**Example Response:**
```json
{
    "success": true,
    "message": "Filter options retrieved successfully",
    "status_code": 200,
    "data": {
        "filter_options": {
            "makes": ["BMW", "Ferrari", "Honda", "Lexus", "Mercedes-Benz", "Mitsubishi", "Nissan", "Porsche", "Tesla", "Toyota"],
            "transmissions": ["Automatic", "Manual"],
            "fuels": ["Diesel", "Electric", "Petrol"],
            "colors": ["Black", "Blue", "Green", "Red", "Silver", "White", "Yellow"],
            "drives": ["4WD", "AWD", "FWD", "RWD"],
            "steerings": ["Left", "Right"],
            "countries": ["Japan"],
            "statuses": ["available", "reserved", "sold"],
            "years": [2018, 2019, 2020, 2021, 2022],
            "categories": [
                {
                    "id": 1,
                    "name": "Sports Cars"
                },
                {
                    "id": 2,
                    "name": "SUVs"
                }
            ]
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
            "category_id": ["The category id field is required."],
            "make": ["The make field is required."],
            "year": ["The year must be at least 1900."]
        }
    }
}
```

### Not Found Error (404)
```json
{
    "success": false,
    "message": "Car not found",
    "status_code": 404,
    "data": []
}
```

### Server Error (500)
```json
{
    "success": false,
    "message": "Failed to retrieve cars: Database connection error",
    "status_code": 500,
    "data": []
}
```

## Search and Filter Examples

### Search by Make/Model
```
GET /api/cars?search=ferrari
```

### Filter by Status
```
GET /api/cars?status=available
```

### Filter by Category
```
GET /api/cars?category_id=1
```

### Filter by Year Range
```
GET /api/cars?year_from=2020&year_to=2022
```

### Filter by Price Range
```
GET /api/cars?price_from=50000&price_to=100000
```

### Filter by Mileage Range
```
GET /api/cars?mileage_from=0&mileage_to=50000
```

### Filter by Transmission
```
GET /api/cars?transmission=Automatic
```

### Filter by Fuel Type
```
GET /api/cars?fuel=Electric
```

### Sort Results
```
GET /api/cars?sort_by=price_amount&sort_order=desc
GET /api/cars?sort_by=year&sort_order=asc
```

### Pagination
```
GET /api/cars?per_page=20&page=2
```

### Combined Filters
```
GET /api/cars?search=bmw&status=available&year_from=2020&price_from=50000&sort_by=price_amount&sort_order=desc&per_page=10
```

## Data Formatting

The API provides formatted data for better display:

- **formatted_price**: Currency symbol + formatted number (e.g., "USD 250,000.00")
- **formatted_mileage**: Number with "km" suffix (e.g., "15,000 km")
- **formatted_engine**: Number with "cc" suffix (e.g., "3,902 cc")
- **full_name**: Make + Model + Variant (e.g., "Ferrari 488 GTB")

## Auto-Generated Fields

- **ref_no**: If not provided, automatically generates "CAR-" + unique ID
- **price_currency**: Defaults to "USD"
- **status**: Defaults to "available"

## Notes

1. **Photo Management**: Cars can have multiple photos with one marked as primary
2. **Chassis Numbers**: Both masked and full chassis numbers are supported
3. **Grades**: Overall grade (0-5), exterior grade (A-Z), interior grade (A-Z)
4. **Validation**: Comprehensive server-side validation with detailed error messages
5. **Search**: Searches across multiple fields including ref_no, make, model, variant, etc.
6. **Pagination**: Default page size is 15, maximum is 100 items per page
7. **Relationships**: Cars are linked to categories and can have multiple photos

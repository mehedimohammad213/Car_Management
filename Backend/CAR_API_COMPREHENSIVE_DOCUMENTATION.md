# Car Management API - Comprehensive Documentation

## Overview
The Car Management API provides comprehensive CRUD operations for managing cars, including two types of car creation methods:
1. **Form-based creation**: Create car with form data including car details, photos, and details
2. **Excel import**: Import cars from Excel files and then update photos/details separately

## Base URL
```
http://your-domain.com/api/cars
```

## Authentication
All endpoints require authentication via Laravel Sanctum. Include the bearer token in the Authorization header:
```
Authorization: Bearer {your-token}
```

## Endpoints

### 1. List Cars with Search, Filter, and Pagination
**GET** `/api/cars`

#### Query Parameters
- `search` (string): Search in ref_no, make, model, variant, model_code, chassis_no_masked, location, notes
- `status` (string): Filter by status (available, sold, reserved, etc.)
- `category_id` (integer): Filter by category ID
- `subcategory_id` (integer): Filter by subcategory ID
- `make` (string): Filter by make
- `year` (integer): Filter by specific year
- `year_from` (integer): Filter by year range start
- `year_to` (integer): Filter by year range end
- `price_from` (decimal): Filter by price range start
- `price_to` (decimal): Filter by price range end
- `mileage_from` (integer): Filter by mileage range start
- `mileage_to` (integer): Filter by mileage range end
- `transmission` (string): Filter by transmission
- `fuel` (string): Filter by fuel type
- `color` (string): Filter by color
- `drive` (string): Filter by drive type
- `steering` (string): Filter by steering type
- `country` (string): Filter by country of origin
- `sort_by` (string): Sort field (default: created_at)
- `sort_direction` (string): Sort direction (asc/desc, default: desc)
- `per_page` (integer): Items per page (default: 15, max: 100)

#### Example Request
```bash
GET /api/cars?search=toyota&year_from=2020&price_from=10000&per_page=20
```

#### Example Response
```json
{
    "success": true,
    "data": {
        "current_page": 1,
        "data": [
            {
                "id": 1,
                "ref_no": "CAR-ABC123",
                "make": "Toyota",
                "model": "Camry",
                "variant": "SE",
                "year": 2020,
                "mileage_km": 50000,
                "price_amount": "25000.00",
                "price_currency": "USD",
                "status": "available",
                "category": {
                    "id": 1,
                    "name": "Sedan"
                },
                "photos": [...],
                "detail": {...}
            }
        ],
        "total": 150,
        "per_page": 20
    },
    "message": "Cars retrieved successfully"
}
```

### 2. Create Car with Form Data
**POST** `/api/cars`

#### Request Body
```json
{
    "category_id": 1,
    "subcategory_id": 2,
    "ref_no": "CAR-ABC123",
    "make": "Toyota",
    "model": "Camry",
    "model_code": "ACV50",
    "variant": "SE",
    "year": 2020,
    "reg_year_month": "2020-03",
    "mileage_km": 50000,
    "engine_cc": 2500,
    "transmission": "Automatic",
    "drive": "FWD",
    "steering": "L",
    "fuel": "Petrol",
    "color": "White",
    "seats": 5,
    "grade_overall": 8.5,
    "grade_exterior": "A",
    "grade_interior": "B",
    "price_amount": 25000.00,
    "price_currency": "USD",
    "price_basis": "FOB",
    "chassis_no_masked": "ABC123456789",
    "location": "Tokyo",
    "country_origin": "Japan",
    "status": "available",
    "notes": "Excellent condition",
    
    "photos": [
        {
            "url": "https://example.com/photo1.jpg",
            "is_primary": true,
            "sort_order": 1,
            "is_hidden": false
        },
        {
            "url": "https://example.com/photo2.jpg",
            "is_primary": false,
            "sort_order": 2,
            "is_hidden": false
        }
    ],
    
    "detail": {
        "short_title": "Toyota Camry SE 2020",
        "full_title": "Toyota Camry SE 2.5L Automatic 2020",
        "description": "A well-maintained Toyota Camry in excellent condition...",
        "images": [
            "https://example.com/detail1.jpg",
            "https://example.com/detail2.jpg"
        ]
    }
}
```

#### Example Response
```json
{
    "success": true,
    "data": {
        "id": 1,
        "ref_no": "CAR-ABC123",
        "make": "Toyota",
        "model": "Camry",
        "photos": [...],
        "detail": {...}
    },
    "message": "Car created successfully"
}
```

### 3. Import Cars from Excel
**POST** `/api/cars/import/excel`

#### Request Body (multipart/form-data)
- `excel_file`: Excel file (xlsx, xls, csv) - max 10MB

#### Supported Excel Columns
- `category`: Category name (required)
- `subcategory`: Subcategory name
- `ref_no`: Reference number
- `make`: Make (required)
- `model`: Model (required)
- `model_code`: Model code
- `variant`: Variant
- `year`: Year (required)
- `reg_year_month`: Registration year-month
- `mileage_km`: Mileage in kilometers
- `engine_cc`: Engine capacity
- `transmission`: Transmission type
- `drive`: Drive type
- `steering`: Steering position
- `fuel`: Fuel type
- `color`: Color
- `seats`: Number of seats
- `grade_overall`: Overall grade
- `grade_exterior`: Exterior grade
- `grade_interior`: Interior grade
- `price_amount`: Price amount
- `price_currency`: Price currency
- `price_basis`: Price basis
- `chassis_no_masked`: Masked chassis number
- `chassis_no_full`: Full chassis number
- `location`: Location
- `country_origin`: Country of origin
- `status`: Status
- `notes`: Notes

#### Example Response
```json
{
    "success": true,
    "message": "Cars imported successfully",
    "imported_count": 25,
    "message": "Please update car photos and details for imported cars"
}
```

### 4. Update Car Photos
**PUT** `/api/cars/{car_id}/photos`

#### Request Body
```json
{
    "photos": [
        {
            "url": "https://example.com/new-photo1.jpg",
            "is_primary": true,
            "sort_order": 1,
            "is_hidden": false
        },
        {
            "url": "https://example.com/new-photo2.jpg",
            "is_primary": false,
            "sort_order": 2,
            "is_hidden": false
        }
    ]
}
```

### 5. Update Car Details
**PUT** `/api/cars/{car_id}/details`

#### Request Body
```json
{
    "short_title": "Updated Short Title",
    "full_title": "Updated Full Title",
    "description": "Updated description...",
    "images": [
        "https://example.com/updated-detail1.jpg",
        "https://example.com/updated-detail2.jpg"
    ]
}
```

### 6. Get Single Car
**GET** `/api/cars/{car_id}`

#### Example Response
```json
{
    "success": true,
    "data": {
        "id": 1,
        "ref_no": "CAR-ABC123",
        "make": "Toyota",
        "model": "Camry",
        "category": {...},
        "subcategory": {...},
        "photos": [...],
        "detail": {...}
    },
    "message": "Car retrieved successfully"
}
```

### 7. Update Car
**PUT** `/api/cars/{car_id}`

#### Request Body
Same structure as create, but all fields are optional.

### 8. Delete Car
**DELETE** `/api/cars/{car_id}`

#### Example Response
```json
{
    "success": true,
    "message": "Car deleted successfully"
}
```

### 9. Get Filter Options
**GET** `/api/cars/filter/options`

#### Example Response
```json
{
    "success": true,
    "data": {
        "makes": ["Toyota", "Honda", "BMW"],
        "models": ["Camry", "Accord", "3 Series"],
        "transmissions": ["Automatic", "Manual"],
        "fuels": ["Petrol", "Diesel", "Hybrid"],
        "colors": ["White", "Black", "Red"],
        "drives": ["FWD", "RWD", "AWD"],
        "steerings": ["L", "R"],
        "countries": ["Japan", "Germany", "USA"],
        "statuses": ["available", "sold", "reserved"],
        "categories": [
            {"id": 1, "name": "Sedan"},
            {"id": 2, "name": "SUV"}
        ],
        "years": [2020, 2021, 2022, 2023, 2024]
    },
    "message": "Filter options retrieved successfully"
}
```

### 10. Bulk Update Car Status
**PUT** `/api/cars/bulk/status`

#### Request Body
```json
{
    "car_ids": [1, 2, 3, 4],
    "status": "sold"
}
```

#### Example Response
```json
{
    "success": true,
    "message": "Status updated for 4 cars",
    "updated_count": 4
}
```

### 11. Export Cars to Excel
**GET** `/api/cars/export/excel`

#### Query Parameters
Same as list cars endpoint for filtering.

#### Example Response
```json
{
    "success": true,
    "message": "Cars exported successfully",
    "file_name": "cars_export_2024-01-15_14-30-25.xlsx",
    "exported_count": 150
}
```

## Error Responses

### Validation Error (422)
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "make": ["The make field is required."],
        "year": ["The year must be at least 1900."]
    }
}
```

### Server Error (500)
```json
{
    "success": false,
    "message": "Failed to create car",
    "error": "Database connection failed"
}
```

### Not Found Error (404)
```json
{
    "success": false,
    "message": "Car not found"
}
```

## Data Models

### Car Model Fields
- `id`: Primary key
- `category_id`: Foreign key to categories table
- `subcategory_id`: Foreign key to categories table (nullable)
- `ref_no`: Unique reference number
- `make`: Car make (e.g., Toyota)
- `model`: Car model (e.g., Camry)
- `model_code`: Model code (e.g., ACV50)
- `variant`: Model variant (e.g., SE)
- `year`: Manufacturing year
- `reg_year_month`: Registration year-month (YYYY-MM format)
- `mileage_km`: Mileage in kilometers
- `engine_cc`: Engine capacity in cubic centimeters
- `transmission`: Transmission type (Automatic, Manual)
- `drive`: Drive type (FWD, RWD, AWD)
- `steering`: Steering position (L, R)
- `fuel`: Fuel type (Petrol, Diesel, Hybrid, Electric)
- `color`: Car color
- `seats`: Number of seats
- `grade_overall`: Overall condition grade (0.0-10.0)
- `grade_exterior`: Exterior condition grade (A, B, C, D)
- `grade_interior`: Interior condition grade (A, B, C, D)
- `price_amount`: Price amount
- `price_currency`: Price currency (3-letter code)
- `price_basis`: Price basis (FOB, CIF, etc.)
- `chassis_no_masked`: Masked chassis number
- `chassis_no_full`: Full chassis number
- `location`: Car location
- `country_origin`: Country of origin
- `status`: Car status (available, sold, reserved, etc.)
- `notes`: Additional notes
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### CarPhoto Model Fields
- `id`: Primary key
- `car_id`: Foreign key to cars table
- `url`: Photo URL
- `is_primary`: Whether this is the primary photo
- `sort_order`: Photo display order
- `is_hidden`: Whether photo is hidden

### CarDetail Model Fields
- `id`: Primary key
- `car_id`: Foreign key to cars table
- `short_title`: Short title for the car
- `full_title`: Full descriptive title
- `description`: Detailed description
- `images`: JSON array of detail image URLs

## Usage Examples

### Create Car with Form
```javascript
const carData = {
    category_id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2020,
    photos: [
        { url: "photo1.jpg", is_primary: true }
    ],
    detail: {
        short_title: "Toyota Camry 2020",
        description: "Excellent condition Toyota Camry"
    }
};

fetch('/api/cars', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(carData)
});
```

### Import Cars from Excel
```javascript
const formData = new FormData();
formData.append('excel_file', excelFile);

fetch('/api/cars/import/excel', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData
});
```

### Search and Filter Cars
```javascript
const params = new URLSearchParams({
    search: 'toyota',
    year_from: '2020',
    price_from: '10000',
    per_page: '20'
});

fetch(`/api/cars?${params}`, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
});
```

## Notes

1. **Excel Import Process**: 
   - Upload Excel file to create car records
   - Use separate endpoints to add photos and details
   - Excel should have headers matching the field names

2. **Photo Management**:
   - Only one photo can be primary per car
   - Photos are automatically reordered when updating
   - Hidden photos are not displayed in public views

3. **Data Validation**:
   - All required fields are validated
   - Year must be between 1900 and current year + 1
   - Price and mileage must be positive numbers
   - Reference numbers must be unique

4. **Performance**:
   - Search and filter operations are optimized with database indexes
   - Pagination is implemented for large datasets
   - Relationships are eager loaded to minimize database queries

5. **Security**:
   - All endpoints require authentication
   - File uploads are validated for type and size
   - SQL injection is prevented through Laravel's query builder

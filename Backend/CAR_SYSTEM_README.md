# Car Management System - User Guide

## Overview
The Car Management System provides two main ways to create and manage cars:

1. **Form-based Creation**: Create cars one by one with detailed information
2. **Excel Import**: Bulk import cars from Excel files

## Getting Started

### Prerequisites
- Laravel 12.x
- PHP 8.2+
- MySQL/PostgreSQL database
- Laravel Excel package (already installed)

### Installation
1. Clone the repository
2. Run `composer install`
3. Copy `.env.example` to `.env` and configure database
4. Run `php artisan migrate`
5. Run `php artisan serve`

## Usage

### Method 1: Form-based Car Creation

#### Step 1: Create Car
Use the `POST /api/cars` endpoint to create a car with all details:

```json
{
    "category_id": 1,
    "make": "Toyota",
    "model": "Camry",
    "year": 2020,
    "mileage_km": 50000,
    "transmission": "Automatic",
    "fuel": "Petrol",
    "color": "White",
    "price_amount": 25000.00,
    "photos": [
        {
            "url": "https://example.com/photo1.jpg",
            "is_primary": true
        }
    ],
    "detail": {
        "short_title": "Toyota Camry 2020",
        "description": "Excellent condition Toyota Camry"
    }
}
```

#### Step 2: Update Photos (Optional)
If you want to add/update photos later:
```bash
PUT /api/cars/{car_id}/photos
```

#### Step 3: Update Details (Optional)
If you want to add/update car details later:
```bash
PUT /api/cars/{car_id}/details
```

### Method 2: Excel Import

#### Step 1: Prepare Excel File
Create an Excel file with the following columns:

**Required Columns:**
- `category` - Category name (must exist in database)
- `make` - Car make
- `model` - Car model  
- `year` - Manufacturing year

**Optional Columns:**
- `subcategory` - Subcategory name
- `ref_no` - Reference number
- `model_code` - Model code
- `variant` - Model variant
- `mileage_km` - Mileage in kilometers
- `transmission` - Transmission type
- `fuel` - Fuel type
- `color` - Car color
- `price_amount` - Price
- `price_currency` - Currency (default: USD)
- `status` - Status (default: available)
- And more...

#### Step 2: Import Cars
Upload the Excel file:
```bash
POST /api/cars/import/excel
Content-Type: multipart/form-data

excel_file: [your_excel_file.xlsx]
```

#### Step 3: Add Photos and Details
After import, cars will have basic information. Add photos and details using:

```bash
# Add photos
PUT /api/cars/{car_id}/photos

# Add details  
PUT /api/cars/{car_id}/details
```

## API Endpoints

### Core CRUD Operations
- `GET /api/cars` - List cars with search/filter
- `POST /api/cars` - Create car with form
- `GET /api/cars/{id}` - Get single car
- `PUT /api/cars/{id}` - Update car
- `DELETE /api/cars/{id}` - Delete car

### Excel Operations
- `POST /api/cars/import/excel` - Import from Excel
- `GET /api/cars/export/excel` - Export to Excel

### Additional Operations
- `PUT /api/cars/{id}/photos` - Update car photos
- `PUT /api/cars/{id}/details` - Update car details
- `PUT /api/cars/bulk/status` - Bulk update status
- `GET /api/cars/filter/options` - Get filter options

## Search and Filtering

### Search
Search across multiple fields:
```bash
GET /api/cars?search=toyota
```

### Filtering
Filter by various criteria:
```bash
GET /api/cars?make=toyota&year_from=2020&price_from=10000
```

### Sorting
Sort by any field:
```bash
GET /api/cars?sort_by=price_amount&sort_direction=desc
```

### Pagination
Control results per page:
```bash
GET /api/cars?per_page=20
```

## Data Models

### Car
Main car information including make, model, year, specifications, pricing, etc.

### CarPhoto
Car photos with primary photo designation and ordering

### CarDetail
Additional car details like titles, descriptions, and detail images

## Best Practices

### 1. Excel Import
- Use consistent category names
- Ensure required fields are filled
- Keep file size under 10MB
- Use proper data formats (dates, numbers)

### 2. Photo Management
- Set one primary photo per car
- Use appropriate image sizes
- Organize photos with sort_order

### 3. Data Validation
- Validate data before import
- Use appropriate field lengths
- Check for duplicate reference numbers

### 4. Performance
- Use pagination for large datasets
- Implement proper database indexes
- Cache frequently accessed data

## Error Handling

### Common Issues
1. **Category not found**: Ensure category exists in database
2. **Invalid year**: Year must be between 1900 and current year + 1
3. **File too large**: Keep Excel files under 10MB
4. **Invalid format**: Use supported Excel formats (.xlsx, .xls, .csv)

### Error Responses
All errors return consistent JSON format:
```json
{
    "success": false,
    "message": "Error description",
    "errors": {...} // For validation errors
}
```

## Examples

### Complete Car Creation
```javascript
// Create car with all details
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
        description: "Excellent condition"
    }
};

fetch('/api/cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carData)
});
```

### Excel Import
```javascript
const formData = new FormData();
formData.append('excel_file', excelFile);

fetch('/api/cars/import/excel', {
    method: 'POST',
    body: formData
});
```

### Search and Filter
```javascript
const params = new URLSearchParams({
    search: 'toyota',
    year_from: '2020',
    price_from: '10000'
});

fetch(`/api/cars?${params}`);
```

## Support

For issues or questions:
1. Check the comprehensive API documentation
2. Review error messages and validation rules
3. Ensure all required dependencies are installed
4. Verify database configuration and migrations

## Changelog

### Version 1.0.0
- Initial release
- Form-based car creation
- Excel import functionality
- Comprehensive search and filtering
- Photo and detail management
- Bulk operations support

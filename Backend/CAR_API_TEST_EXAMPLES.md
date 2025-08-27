# Car API Test Examples

This file contains practical examples of how to test the Car API endpoints using various tools.

## Prerequisites

1. Make sure your Laravel application is running
2. Run the database migrations: `php artisan migrate`
3. Seed the database: `php artisan db:seed`
4. Create storage link: `php artisan storage:link`

## Testing with cURL

### 1. Get All Cars
```bash
curl -X GET "http://localhost:8000/api/cars" \
  -H "Accept: application/json"
```

### 2. Get Cars with Search
```bash
curl -X GET "http://localhost:8000/api/cars?search=ferrari" \
  -H "Accept: application/json"
```

### 3. Get Cars with Filters
```bash
# Filter by status
curl -X GET "http://localhost:8000/api/cars?status=available" \
  -H "Accept: application/json"

# Filter by category
curl -X GET "http://localhost:8000/api/cars?category_id=1" \
  -H "Accept: application/json"

# Filter by make
curl -X GET "http://localhost:8000/api/cars?make=Ferrari" \
  -H "Accept: application/json"

# Filter by year range
curl -X GET "http://localhost:8000/api/cars?year_from=2020&year_to=2022" \
  -H "Accept: application/json"

# Filter by price range
curl -X GET "http://localhost:8000/api/cars?price_from=100000&price_to=300000" \
  -H "Accept: application/json"
```

### 4. Get Cars with Sorting and Pagination
```bash
curl -X GET "http://localhost:8000/api/cars?sort_by=price_amount&sort_order=desc&per_page=5" \
  -H "Accept: application/json"
```

### 5. Create a New Car
```bash
curl -X POST "http://localhost:8000/api/cars" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "make": "Audi",
    "model": "R8",
    "variant": "V10",
    "year": 2021,
    "mileage_km": 12000,
    "engine_cc": 5204,
    "transmission": "Automatic",
    "drive": "AWD",
    "steering": "Right",
    "fuel": "Petrol",
    "color": "Black",
    "seats": 2,
    "grade_overall": 4.7,
    "price_amount": 180000.00,
    "location": "Tokyo, Japan",
    "country_origin": "Japan",
    "status": "available",
    "notes": "High-performance sports car"
  }'
```

### 6. Get Single Car
```bash
curl -X GET "http://localhost:8000/api/cars/1" \
  -H "Accept: application/json"
```

### 7. Update Car
```bash
curl -X PUT "http://localhost:8000/api/cars/1" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "price_amount": 240000.00,
    "status": "reserved",
    "notes": "Updated - car is now reserved"
  }'
```

### 8. Delete Car
```bash
curl -X DELETE "http://localhost:8000/api/cars/1" \
  -H "Accept: application/json"
```

### 9. Get Car Statistics
```bash
curl -X GET "http://localhost:8000/api/cars/stats/overview" \
  -H "Accept: application/json"
```

### 10. Get Filter Options
```bash
curl -X GET "http://localhost:8000/api/cars/filter/options" \
  -H "Accept: application/json"
```

## Testing with Postman

### Collection Import
You can import this collection into Postman:

```json
{
  "info": {
    "name": "Car API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Cars",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/cars",
          "host": ["{{base_url}}"],
          "path": ["api", "cars"]
        }
      }
    },
    {
      "name": "Create Car",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"category_id\": 1,\n  \"make\": \"Audi\",\n  \"model\": \"R8\",\n  \"year\": 2021,\n  \"status\": \"available\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/api/cars",
          "host": ["{{base_url}}"],
          "path": ["api", "cars"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    }
  ]
}
```

## Testing with JavaScript/Fetch

### Get All Cars
```javascript
fetch('http://localhost:8000/api/cars')
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

### Create Car
```javascript
const carData = {
  category_id: 1,
  make: 'Audi',
  model: 'R8',
  variant: 'V10',
  year: 2021,
  mileage_km: 12000,
  engine_cc: 5204,
  transmission: 'Automatic',
  drive: 'AWD',
  steering: 'Right',
  fuel: 'Petrol',
  color: 'Black',
  seats: 2,
  grade_overall: 4.7,
  price_amount: 180000.00,
  location: 'Tokyo, Japan',
  country_origin: 'Japan',
  status: 'available',
  notes: 'High-performance sports car'
};

fetch('http://localhost:8000/api/cars', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(carData)
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
```

### Update Car
```javascript
const updateData = {
  price_amount: 240000.00,
  status: 'reserved',
  notes: 'Updated - car is now reserved'
};

fetch('http://localhost:8000/api/cars/1', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(updateData)
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
```

## Testing with PHP

### Using Guzzle HTTP Client
```php
<?php

require 'vendor/autoload.php';

use GuzzleHttp\Client;

$client = new Client();

// Get all cars
$response = $client->get('http://localhost:8000/api/cars');
$data = json_decode($response->getBody(), true);
print_r($data);

// Create car
$response = $client->post('http://localhost:8000/api/cars', [
    'json' => [
        'category_id' => 1,
        'make' => 'Audi',
        'model' => 'R8',
        'year' => 2021,
        'status' => 'available'
    ]
]);
$data = json_decode($response->getBody(), true);
print_r($data);
```

## Expected Test Results

After running the seeder, you should have:

- **12 Cars**: Various makes and models across different categories
- **Different Statuses**: Available, reserved, and sold cars
- **Price Range**: From $25,000 to $350,000
- **Year Range**: 2018 to 2022
- **Multiple Makes**: Ferrari, Porsche, Toyota, Lexus, Honda, Mercedes-Benz, BMW, Tesla, Nissan, Mitsubishi, Lamborghini

### Sample API Responses

**Get All Cars Response:**
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
        "full_name": "Ferrari 488 GTB",
        "year": 2020,
        "formatted_price": "USD 250,000.00",
        "formatted_mileage": "15,000 km",
        "status": "available",
        "category": {
          "id": 1,
          "name": "Sports Cars"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 15,
      "total": 12,
      "from": 1,
      "to": 12
    }
  }
}
```

**Statistics Response:**
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
      ]
    }
  }
}
```

**Filter Options Response:**
```json
{
  "success": true,
  "message": "Filter options retrieved successfully",
  "status_code": 200,
  "data": {
    "filter_options": {
      "makes": ["BMW", "Ferrari", "Honda", "Lexus", "Mercedes-Benz", "Mitsubishi", "Nissan", "Porsche", "Tesla", "Toyota"],
      "transmissions": ["Automatic"],
      "fuels": ["Diesel", "Electric", "Petrol"],
      "colors": ["Black", "Blue", "Green", "Red", "Silver", "White", "Yellow"],
      "drives": ["4WD", "AWD", "FWD", "RWD"],
      "steerings": ["Right"],
      "countries": ["Japan"],
      "statuses": ["available", "reserved", "sold"],
      "years": [2018, 2019, 2020, 2021, 2022]
    }
  }
}
```

## Advanced Filter Examples

### Complex Search with Multiple Filters
```bash
curl -X GET "http://localhost:8000/api/cars?search=ferrari&status=available&year_from=2020&price_from=200000&transmission=Automatic&sort_by=price_amount&sort_order=desc&per_page=5" \
  -H "Accept: application/json"
```

### Filter by Multiple Criteria
```bash
curl -X GET "http://localhost:8000/api/cars?category_id=1&fuel=Petrol&drive=RWD&color=Red&sort_by=year&sort_order=desc" \
  -H "Accept: application/json"
```

### Search by Chassis Number
```bash
curl -X GET "http://localhost:8000/api/cars?search=ZFF" \
  -H "Accept: application/json"
```

## Troubleshooting

1. **CORS Issues**: If testing from a frontend application, you may need to configure CORS in Laravel
2. **Database Issues**: Ensure migrations are run and database is seeded
3. **Validation Errors**: Check the response for detailed validation error messages
4. **Category Dependencies**: Make sure categories exist before creating cars
5. **Photo Management**: Car photos are handled separately through the CarPhoto model

## Performance Tips

1. **Use Pagination**: Always use pagination for large datasets
2. **Specific Filters**: Use specific filters instead of broad searches when possible
3. **Indexed Fields**: The API is optimized for searches on indexed fields like make, model, year
4. **Caching**: Consider implementing caching for filter options and statistics

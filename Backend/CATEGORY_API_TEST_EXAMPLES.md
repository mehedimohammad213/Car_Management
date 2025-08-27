# Category API Test Examples

This file contains practical examples of how to test the Category API endpoints using various tools.

## Prerequisites

1. Make sure your Laravel application is running
2. Run the database migrations: `php artisan migrate`
3. Seed the database: `php artisan db:seed`
4. Create storage link: `php artisan storage:link`

## Testing with cURL

### 1. Get All Categories
```bash
curl -X GET "http://localhost:8000/api/categories" \
  -H "Accept: application/json"
```

### 2. Get Categories with Search
```bash
curl -X GET "http://localhost:8000/api/categories?search=sports" \
  -H "Accept: application/json"
```

### 3. Get Categories with Filters
```bash
# Filter by status
curl -X GET "http://localhost:8000/api/categories?status=active" \
  -H "Accept: application/json"

# Filter by type
curl -X GET "http://localhost:8000/api/categories?type=parent" \
  -H "Accept: application/json"

# Filter by parent category
curl -X GET "http://localhost:8000/api/categories?parent_id=1" \
  -H "Accept: application/json"
```

### 4. Get Categories with Sorting and Pagination
```bash
curl -X GET "http://localhost:8000/api/categories?sort_by=name&sort_order=asc&per_page=5" \
  -H "Accept: application/json"
```

### 5. Create a New Category
```bash
curl -X POST "http://localhost:8000/api/categories" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category",
    "parent_category_id": 1,
    "status": "active",
    "short_des": "This is a test category"
  }'
```

### 6. Create Category with Image Upload
```bash
curl -X POST "http://localhost:8000/api/categories" \
  -H "Accept: application/json" \
  -F "name=Category with Image" \
  -F "image=@/path/to/your/image.jpg" \
  -F "status=active" \
  -F "short_des=Category with uploaded image"
```

### 7. Get Single Category
```bash
curl -X GET "http://localhost:8000/api/categories/1" \
  -H "Accept: application/json"
```

### 8. Update Category
```bash
curl -X PUT "http://localhost:8000/api/categories/1" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Category Name",
    "status": "active",
    "short_des": "Updated description"
  }'
```

### 9. Delete Category
```bash
curl -X DELETE "http://localhost:8000/api/categories/1" \
  -H "Accept: application/json"
```

### 10. Get Parent Categories
```bash
curl -X GET "http://localhost:8000/api/categories/parent/list" \
  -H "Accept: application/json"
```

### 11. Get Category Statistics
```bash
curl -X GET "http://localhost:8000/api/categories/stats/overview" \
  -H "Accept: application/json"
```

## Testing with Postman

### Collection Import
You can import this collection into Postman:

```json
{
  "info": {
    "name": "Category API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Categories",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Accept",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}/api/categories",
          "host": ["{{base_url}}"],
          "path": ["api", "categories"]
        }
      }
    },
    {
      "name": "Create Category",
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
          "raw": "{\n  \"name\": \"Test Category\",\n  \"parent_category_id\": 1,\n  \"status\": \"active\",\n  \"short_des\": \"Test description\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{base_url}}/api/categories",
          "host": ["{{base_url}}"],
          "path": ["api", "categories"]
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

### Get All Categories
```javascript
fetch('http://localhost:8000/api/categories')
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
```

### Create Category
```javascript
const categoryData = {
  name: 'JavaScript Category',
  parent_category_id: 1,
  status: 'active',
  short_des: 'Created via JavaScript'
};

fetch('http://localhost:8000/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify(categoryData)
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch((error) => {
  console.error('Error:', error);
});
```

### Update Category
```javascript
const updateData = {
  name: 'Updated JavaScript Category',
  status: 'active',
  short_des: 'Updated via JavaScript'
};

fetch('http://localhost:8000/api/categories/1', {
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

// Get all categories
$response = $client->get('http://localhost:8000/api/categories');
$data = json_decode($response->getBody(), true);
print_r($data);

// Create category
$response = $client->post('http://localhost:8000/api/categories', [
    'json' => [
        'name' => 'PHP Category',
        'parent_category_id' => 1,
        'status' => 'active',
        'short_des' => 'Created via PHP'
    ]
]);
$data = json_decode($response->getBody(), true);
print_r($data);
```

## Expected Test Results

After running the seeder, you should have:

- **5 Parent Categories**: Sports Cars, SUVs, Sedans, Luxury Vehicles, Electric Vehicles
- **15 Child Categories**: Various subcategories under each parent
- **2 Inactive Categories**: Vintage Cars, Hybrid Vehicles

### Sample API Responses

**Get All Categories Response:**
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
        "image": null,
        "parent_category_id": null,
        "parent_category": null,
        "status": "active",
        "short_des": "High-performance sports vehicles designed for speed and agility",
        "full_name": "Sports Cars",
        "children_count": 3,
        "cars_count": 0,
        "created_at": "2025-08-27T10:00:00.000000Z",
        "updated_at": "2025-08-27T10:00:00.000000Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "last_page": 1,
      "per_page": 15,
      "total": 22,
      "from": 1,
      "to": 22
    }
  }
}
```

**Statistics Response:**
```json
{
  "success": true,
  "message": "Category statistics retrieved successfully",
  "status_code": 200,
  "data": {
    "statistics": {
      "total_categories": 22,
      "active_categories": 20,
      "inactive_categories": 2,
      "parent_categories": 5,
      "child_categories": 17
    }
  }
}
```

## Troubleshooting

1. **CORS Issues**: If testing from a frontend application, you may need to configure CORS in Laravel
2. **Storage Issues**: Make sure to run `php artisan storage:link` for image uploads
3. **Database Issues**: Ensure migrations are run and database is seeded
4. **Validation Errors**: Check the response for detailed validation error messages

# Stock Management System

## Overview
The Stock Management System provides comprehensive CRUD operations for managing car inventory stock, including advanced filtering, search capabilities, and bulk operations.

## Features

### 🚗 **Core Functionality**
- **Create Stock**: Add new stock records for cars
- **Read Stock**: Retrieve stock information with relationships
- **Update Stock**: Modify stock details and status
- **Delete Stock**: Remove stock records
- **Search & Filter**: Advanced filtering and search capabilities
- **Bulk Operations**: Mass update stock statuses
- **Statistics**: Comprehensive stock analytics

### 🔍 **Advanced Features**
- **Smart Filtering**: Filter by status, price range, quantity range
- **Search**: Search across car make, model, and reference number
- **Sorting**: Sort by any field in ascending/descending order
- **Pagination**: Configurable page sizes for large datasets
- **Relationship Loading**: Automatic loading of car, category, and photo data
- **Status Synchronization**: Automatic car status updates when stock changes

## Database Structure

### Stocks Table
```sql
CREATE TABLE stocks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    car_id BIGINT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NULL,
    status ENUM('available', 'sold', 'reserved', 'damaged', 'lost', 'stolen') DEFAULT 'available',
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);
```

### Key Relationships
- **One-to-One**: Each car can have only one stock record
- **Cascade Protection**: Deleting a stock resets car status to 'available'
- **Status Sync**: Stock status changes automatically update car status

## API Endpoints

### Base URL
```
http://localhost:8000/api/stocks
```

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stocks` | Get all stocks with filtering and pagination |
| `POST` | `/api/stocks` | Create new stock |
| `GET` | `/api/stocks/{id}` | Get single stock details |
| `PUT` | `/api/stocks/{id}` | Update stock information |
| `DELETE` | `/api/stocks/{id}` | Delete stock |
| `GET` | `/api/stocks/stats/overview` | Get stock statistics |
| `PUT` | `/api/stocks/bulk/status` | Bulk update stock statuses |
| `GET` | `/api/stocks/available/cars` | Get cars available for stock creation |

## Filtering & Search

### Query Parameters

#### Status Filter
```
?status=available
```
- Values: `available`, `sold`, `reserved`, `damaged`, `lost`, `stolen`

#### Price Range Filter
```
?min_price=10000&max_price=50000
```

#### Quantity Range Filter
```
?min_quantity=1&max_quantity=10
```

#### Search Filter
```
?search=toyota
```
- Searches in: car make, model, reference number

#### Sorting
```
?sort_by=price&sort_order=asc
```
- Default: `created_at` in `desc` order

#### Pagination
```
?per_page=20
```
- Default: 15 items per page

### Example Complex Query
```
GET /api/stocks?status=available&min_price=20000&max_price=50000&search=toyota&sort_by=price&sort_order=asc&per_page=25
```

## Data Models

### Stock Model
```php
class Stock extends Model
{
    protected $fillable = [
        'car_id', 'quantity', 'price', 'status', 'notes'
    ];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'status' => 'string',
    ];

    // Relationships
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }

    // Scopes for filtering
    public function scopeByStatus($query, $status)
    public function scopeByPriceRange($query, $minPrice, $maxPrice)
    public function scopeByQuantityRange($query, $minQuantity, $maxQuantity)
    public function scopeSearchByCar($query, $search)
}
```

## Business Logic

### Stock Creation Rules
1. **One Stock Per Car**: Each car can only have one stock record
2. **Validation**: All required fields must be provided
3. **Car Status Sync**: Car status is automatically updated to match stock status
4. **Duplicate Prevention**: Cannot create stock for car that already has stock

### Stock Update Rules
1. **Partial Updates**: Only provided fields are updated
2. **Status Synchronization**: Car status automatically syncs with stock status
3. **Validation**: All updates are validated before processing

### Stock Deletion Rules
1. **Cascade Protection**: Deleting stock resets car status to 'available'
2. **Data Integrity**: Maintains referential integrity

## Error Handling

### Validation Errors (422)
- Field validation failures
- Business rule violations
- Invalid data types

### Business Logic Errors (409)
- Duplicate stock creation attempts
- Invalid status transitions

### Server Errors (500)
- Database connection issues
- Internal processing errors

## Security Features

### Authentication
- Laravel Sanctum integration
- Bearer token authentication
- Protected routes

### Validation
- Input sanitization
- Business rule enforcement
- SQL injection prevention

### Data Integrity
- Foreign key constraints
- Transaction management
- Rollback protection

## Performance Optimizations

### Database Queries
- Eager loading of relationships
- Optimized filtering with scopes
- Pagination for large datasets

### Caching
- Query result caching
- Relationship data caching
- Statistics caching

### Indexing
- Primary key indexing
- Foreign key indexing
- Status field indexing

## Testing

### Seeder
```bash
php artisan db:seed --class=StockSeeder
```

### API Testing
- Comprehensive test examples provided
- cURL commands for all endpoints
- Postman collection available
- Validation testing scenarios

### Performance Testing
- Large dataset handling
- Complex filtering performance
- Bulk operation testing

## Usage Examples

### Create Stock
```bash
curl -X POST "http://localhost:8000/api/stocks" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "car_id": 1,
    "quantity": 5,
    "price": 25000.00,
    "status": "available",
    "notes": "New arrival"
  }'
```

### Get Filtered Stocks
```bash
curl -X GET "http://localhost:8000/api/stocks?status=available&min_price=20000&search=toyota" \
  -H "Authorization: Bearer {token}"
```

### Update Stock Status
```bash
curl -X PUT "http://localhost:8000/api/stocks/1" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"status": "sold"}'
```

## Monitoring & Analytics

### Statistics Endpoint
- Total stock count
- Total quantity
- Total value
- Status distribution
- Category distribution

### Performance Metrics
- Response times
- Query execution times
- Memory usage
- Error rates

## Deployment

### Requirements
- Laravel 10+
- PHP 8.1+
- MySQL 8.0+ or PostgreSQL 13+
- Composer

### Installation
1. Clone the repository
2. Install dependencies: `composer install`
3. Configure environment variables
4. Run migrations: `php artisan migrate`
5. Seed database: `php artisan db:seed`
6. Start server: `php artisan serve`

### Environment Variables
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=car_management
DB_USERNAME=root
DB_PASSWORD=
```

## Support & Documentation

### API Documentation
- Complete endpoint documentation
- Request/response examples
- Error code explanations
- Testing scenarios

### Code Documentation
- Inline code comments
- PHPDoc blocks
- Architecture explanations
- Business logic documentation

### Testing Resources
- Test data seeders
- API testing examples
- Performance testing guidelines
- Error testing scenarios

## Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration for live stock updates
- **Advanced Analytics**: Machine learning for stock predictions
- **Multi-warehouse**: Support for multiple storage locations
- **Inventory Alerts**: Low stock notifications
- **Export/Import**: Excel/CSV data exchange

### Performance Improvements
- **Redis Caching**: Advanced caching strategies
- **Database Optimization**: Query optimization and indexing
- **API Rate Limiting**: Enhanced rate limiting
- **Background Jobs**: Async processing for heavy operations

## Contributing

### Development Guidelines
1. Follow PSR-12 coding standards
2. Write comprehensive tests
3. Document all new features
4. Maintain backward compatibility
5. Follow Git flow branching model

### Code Review Process
1. Feature branch creation
2. Code implementation
3. Test coverage
4. Documentation updates
5. Pull request review
6. Merge to main branch

## License
This project is licensed under the MIT License - see the LICENSE file for details.

# 🚗 Car Management System - Backend API

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-12.x-red.svg" alt="Laravel Version">
  <img src="https://img.shields.io/badge/PHP-8.2+-blue.svg" alt="PHP Version">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg" alt="Status">
</p>

## 📋 Overview

The Car Management System Backend is a robust Laravel-based REST API designed for managing car inventory, orders, and customer data. It provides comprehensive functionality for car dealerships, including inventory management, order processing, user authentication, and advanced search capabilities.

## ✨ Key Features

### 🚙 Car Management
- **Dual Creation Methods**: Form-based creation and Excel bulk import
- **Advanced Search & Filtering**: Multi-field search with pagination
- **Photo Management**: Multiple photos per car with primary photo designation
- **Detailed Specifications**: Complete car details with sub-details
- **Bulk Operations**: Status updates and data management
- **Excel Import/Export**: Seamless data migration and backup

### 👥 User Management
- **Role-based Access Control**: Admin and Customer roles
- **Secure Authentication**: Laravel Sanctum token-based auth
- **User Profiles**: Complete user management system

### 🛒 Order Management
- **Shopping Cart**: Persistent cart functionality
- **Order Processing**: Complete order lifecycle management
- **Invoice Generation**: PDF invoice creation
- **Order Tracking**: Status updates and notifications

### 📊 Analytics & Reporting
- **Sales Analytics**: Revenue tracking and reporting
- **Inventory Reports**: Stock management and alerts
- **Performance Metrics**: System usage statistics

## 🛠️ Technology Stack

- **Framework**: Laravel 12.x
- **PHP Version**: 8.2+
- **Database**: MySQL/PostgreSQL (SQLite for development)
- **Authentication**: Laravel Sanctum
- **File Processing**: Laravel Excel (Maatwebsite)
- **API**: RESTful API with JSON responses
- **Testing**: PHPUnit

## 📦 Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL 8.0+ or PostgreSQL 13+
- Node.js 16+ (for frontend assets)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Car Management System/Backend"
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database configuration**
   ```bash
   # Configure your database in .env file
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=car_management
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. **Run migrations and seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

6. **Start the development server**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

## 🔧 Configuration

### Environment Variables

Key configuration options in `.env`:

```env
APP_NAME="Car Management System"
APP_ENV=production
APP_KEY=your-generated-key
APP_DEBUG=false
APP_URL=http://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=car_management
DB_USERNAME=your_username
DB_PASSWORD=your_password

SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1
SESSION_DOMAIN=localhost

CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

## 📚 API Documentation

### Authentication
All API endpoints require authentication via Laravel Sanctum. Include the bearer token in the Authorization header:

```
Authorization: Bearer {your-token}
```

### Core Endpoints

#### Cars Management
- `GET /api/cars` - List cars with search/filter/pagination
- `POST /api/cars` - Create new car
- `GET /api/cars/{id}` - Get car details
- `PUT /api/cars/{id}` - Update car
- `DELETE /api/cars/{id}` - Delete car

#### Excel Operations
- `POST /api/cars/import/excel` - Import cars from Excel
- `GET /api/cars/export/excel` - Export cars to Excel

#### User Management
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/user` - Get current user

#### Orders & Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove` - Remove from cart
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Search & Filtering

Advanced search capabilities:
```bash
GET /api/cars?search=toyota&year_from=2020&price_from=10000&per_page=20
```

Available filters:
- `search` - Multi-field search
- `make`, `model`, `year` - Basic filters
- `year_from`, `year_to` - Year range
- `price_from`, `price_to` - Price range
- `mileage_from`, `mileage_to` - Mileage range
- `transmission`, `fuel`, `color` - Specification filters
- `sort_by`, `sort_direction` - Sorting options

## 🗄️ Database Schema

### Core Models

- **Cars**: Main car inventory with specifications
- **CarPhotos**: Multiple photos per car
- **CarDetails**: Additional car information
- **CarSubDetails**: Extended specifications
- **Categories**: Car categorization
- **Users**: User management with roles
- **Orders**: Order processing
- **OrderItems**: Individual order items
- **Cart**: Shopping cart functionality
- **Stock**: Inventory tracking

## 🚀 Usage Examples

### Create a Car
```javascript
const carData = {
    category_id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2020,
    mileage_km: 50000,
    transmission: "Automatic",
    fuel: "Petrol",
    color: "White",
    price_amount: 25000.00,
    photos: [
        { url: "https://example.com/photo1.jpg", is_primary: true }
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
        'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(carData)
});
```

### Excel Import
```javascript
const formData = new FormData();
formData.append('excel_file', excelFile);

fetch('/api/cars/import/excel', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    body: formData
});
```

### Advanced Search
```javascript
const params = new URLSearchParams({
    search: 'toyota',
    year_from: '2020',
    price_from: '10000',
    sort_by: 'price_amount',
    sort_direction: 'desc'
});

fetch(`/api/cars?${params}`, {
    headers: { 'Authorization': 'Bearer ' + token }
});
```

## 🔐 Demo Credentials

### Admin User
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Full system access

### Regular User
- **Username**: `user`
- **Password**: `user123`
- **Role**: Customer access

## 🧪 Testing

Run the test suite:
```bash
php artisan test
```

Run specific test files:
```bash
php artisan test --filter=CarTest
```

## 📈 Performance Optimization

- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Redis/Memcached support for frequently accessed data
- **Pagination**: Efficient data loading with pagination
- **Image Optimization**: Compressed image handling
- **API Rate Limiting**: Built-in rate limiting for API endpoints

## 🔒 Security Features

- **CSRF Protection**: Cross-site request forgery protection
- **SQL Injection Prevention**: Eloquent ORM with parameter binding
- **XSS Protection**: Input sanitization and output escaping
- **Rate Limiting**: API endpoint protection
- **Secure Headers**: Security headers implementation
- **Token Authentication**: Secure API authentication

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   APP_ENV=production
   APP_DEBUG=false
   ```

2. **Database Migration**
   ```bash
   php artisan migrate --force
   ```

3. **Cache Optimization**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Queue Setup** (for background jobs)
   ```bash
   php artisan queue:work
   ```

## 📝 API Documentation

For comprehensive API documentation, see:
- `car/CAR_API_COMPREHENSIVE_DOCUMENTATION.md`
- `car/CAR_API_DOCUMENTATION.md`
- `car/CAR_API_TEST_EXAMPLES.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check the comprehensive documentation in the `car/` directory
- Review API test examples
- Open an issue on GitHub

## 🏗️ Architecture

The system follows Laravel's MVC architecture with:
- **Models**: Eloquent ORM for database interactions
- **Controllers**: API controllers handling HTTP requests
- **Services**: Business logic separation
- **Jobs**: Background job processing
- **Middleware**: Request/response processing
- **Resources**: API response formatting

---

**Built with ❤️ using Laravel and modern PHP practices**

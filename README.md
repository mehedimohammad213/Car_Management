# 🚗 Car Management System

A comprehensive full-stack car management and selling platform built with Laravel (Backend) and React (Frontend). This system provides a complete solution for managing car inventory, categories, orders, and customer interactions with role-based access control.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Frontend Features](#-frontend-features)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Features

### 🔐 Authentication & Authorization

- **Role-based Access Control**: Admin and User roles with different permissions
- **Secure Authentication**: Laravel Sanctum for API authentication
- **Protected Routes**: Frontend route protection based on user roles
- **Session Management**: Persistent login state with secure logout

### 🚗 Car Management (Admin)

- **Complete CRUD Operations**: Create, read, update, and delete cars
- **Advanced Search & Filtering**: Search by make, model, year, price, mileage, etc.
- **Image Management**: Multiple photos per car with primary photo selection
- **Inventory Tracking**: Real-time stock management and status updates
- **Bulk Operations**: Manage multiple cars simultaneously
- **Export/Import**: Data export capabilities for reporting

### 📊 Dashboard & Analytics (Admin)

- **Sales Overview**: Monthly and yearly sales reports
- **Inventory Statistics**: Total stock, available cars, sold cars
- **Performance Metrics**: Revenue tracking and growth analytics
- **Interactive Charts**: Visual data representation with Recharts
- **Real-time Updates**: Live data refresh capabilities

### 🛒 Customer Features (User)

- **Car Catalog**: Browse and search through available cars
- **Advanced Filtering**: Filter by price, year, make, transmission, fuel type
- **Car Details**: Comprehensive car information with photo galleries
- **Shopping Cart**: Add cars to cart with quantity management
- **Wishlist**: Save favorite cars for later
- **Order Management**: Place orders and track order history
- **User Profile**: Manage personal information and preferences

### 📱 User Experience

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes for better user experience
- **Modern UI**: Clean, professional interface built with Tailwind CSS
- **Real-time Search**: Instant search results as you type
- **Pagination**: Efficient data loading with pagination support

## 🛠️ Tech Stack

### Backend

- **Laravel 12** - PHP framework
- **Laravel Sanctum** - API authentication
- **SQLite/MySQL** - Database
- **Eloquent ORM** - Database abstraction
- **Laravel Migrations** - Database versioning
- **Laravel Seeders** - Sample data generation

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Context API** - State management

### Development Tools

- **Composer** - PHP dependency management
- **npm** - Node.js package management
- **Vite** - Build tool and dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🏗️ Architecture

```
Car Management System/
├── Backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/    # API Controllers
│   │   ├── Models/              # Eloquent Models
│   │   └── Services/            # Business Logic
│   ├── database/
│   │   ├── migrations/          # Database schema
│   │   └── seeders/             # Sample data
│   ├── routes/
│   │   └── api.php              # API routes
│   └── storage/                 # File storage
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   ├── pages/               # Page components
│   │   ├── contexts/            # State management
│   │   ├── services/            # API services
│   │   └── types/               # TypeScript definitions
│   └── public/                  # Static assets
└── README.md               # This file
```

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2 or higher**
- **Composer** (PHP package manager)
- **Node.js 16 or higher**
- **npm or yarn**
- **MySQL 8.0+ or SQLite**
- **Git**

### 1. Clone the Repository

```bash
git clone <repository-url>
cd "Car Management System"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# For SQLite (default):
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite

# For MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=cms
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run database migrations
php artisan migrate

# Seed database with sample data (optional)
php artisan db:seed

# Create storage link for file uploads
php artisan storage:link

# Start the development server
php artisan serve
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node.js dependencies
npm install

# Start the development server
npm start
```

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the Backend directory:

```env
APP_NAME="Car Management System"
APP_ENV=local
APP_KEY=your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=sqlite
DB_DATABASE=/absolute/path/to/database/database.sqlite

# For MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=cms
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000

# File Storage
FILESYSTEM_DISK=public
```

### Frontend Configuration

Update the API base URL in your frontend configuration:

```typescript
// src/services/api.ts
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";
```

## 📚 API Documentation

The backend provides a comprehensive REST API with the following endpoints:

### Car API

- `GET /api/cars` - Get all cars with search, filter, and pagination
- `POST /api/cars` - Create a new car
- `GET /api/cars/{id}` - Get a specific car
- `PUT /api/cars/{id}` - Update a car
- `DELETE /api/cars/{id}` - Delete a car
- `GET /api/cars/stats/overview` - Get car statistics
- `GET /api/cars/filter/options` - Get filter options

### Category API

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/{id}` - Get a specific category
- `PUT /api/categories/{id}` - Update a category
- `DELETE /api/categories/{id}` - Delete a category
- `GET /api/categories/parent/list` - Get parent categories
- `GET /api/categories/stats/overview` - Get category statistics

For detailed API documentation, see:

- [Car API Documentation](Backend/CAR_API_DOCUMENTATION.md)
- [Category API Documentation](Backend/CATEGORY_API_DOCUMENTATION.md)

## 🎨 Frontend Features

### Admin Dashboard

- **Sales Analytics**: Interactive charts showing monthly sales and revenue
- **Inventory Overview**: Real-time statistics on car stock and status
- **Quick Actions**: Direct access to car management and order processing
- **Performance Metrics**: Key performance indicators and trends

### Car Management

- **Advanced Search**: Search across multiple fields (make, model, year, etc.)
- **Smart Filtering**: Filter by price range, year, transmission, fuel type
- **Bulk Operations**: Select and manage multiple cars simultaneously
- **Image Gallery**: Upload and manage multiple photos per car
- **Status Management**: Track car availability and sales status

### Customer Interface

- **Car Catalog**: Grid and list view options for browsing cars
- **Detailed Car Pages**: Comprehensive car information with photo galleries
- **Shopping Cart**: Add cars to cart with quantity management
- **Order History**: Track past orders and download invoices
- **User Profile**: Manage personal information and preferences

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced experience for tablet users
- **Desktop Optimization**: Full-featured desktop interface
- **Cross-Browser**: Compatible with all modern browsers

## 🗄️ Database Schema

### Core Tables

#### Cars Table

- `id` - Primary key
- `ref_no` - Unique reference number
- `make`, `model`, `variant` - Car identification
- `year`, `mileage_km` - Car specifications
- `price_amount`, `price_currency` - Pricing information
- `status` - Availability status
- `category_id` - Foreign key to categories
- `created_at`, `updated_at` - Timestamps

#### Categories Table

- `id` - Primary key
- `name` - Category name
- `parent_category_id` - Self-referencing for hierarchy
- `status` - Active/inactive status
- `image` - Category image
- `short_des` - Description
- `created_at`, `updated_at` - Timestamps

#### Car Photos Table

- `id` - Primary key
- `car_id` - Foreign key to cars
- `image_url` - Photo URL
- `is_primary` - Primary photo flag
- `caption` - Photo description
- `created_at`, `updated_at` - Timestamps

#### Users Table

- `id` - Primary key
- `name`, `email` - User information
- `role` - Admin/User role
- `email_verified_at` - Verification timestamp
- `password` - Hashed password
- `created_at`, `updated_at` - Timestamps

## 🚀 Deployment

### Production Environment Setup

1. **Server Requirements**:

   - PHP 8.2+
   - MySQL 8.0+ or PostgreSQL 13+
   - Node.js 16+
   - Web server (Apache/Nginx)

2. **Backend Deployment**:

   ```bash
   # Install dependencies
   composer install --optimize-autoloader --no-dev

   # Configure environment
   cp .env.example .env
   # Edit .env with production values

   # Generate key and optimize
   php artisan key:generate
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache

   # Run migrations
   php artisan migrate --force

   # Create storage link
   php artisan storage:link
   ```

3. **Frontend Deployment**:

   ```bash
   # Build for production
   npm run build

   # Serve static files
   # Copy build/ contents to web server
   ```

### Docker Deployment (Optional)

```dockerfile
# Backend Dockerfile
FROM php:8.2-fpm
# ... Laravel setup

# Frontend Dockerfile
FROM node:16-alpine
# ... React build
```

## 🧪 Testing

### Backend Testing

```bash
cd Backend
php artisan test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 📈 Performance Optimization

### Backend Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Laravel caching for frequently accessed data
- **Image Optimization**: Compressed images for faster loading
- **API Rate Limiting**: Protection against abuse

### Frontend Optimizations

- **Code Splitting**: Lazy loading of components
- **Image Lazy Loading**: Deferred image loading
- **Bundle Optimization**: Minimized JavaScript bundles
- **Caching**: Browser caching for static assets

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Eloquent ORM with parameterized queries
- **XSS Protection**: Output sanitization and CSRF tokens
- **Authentication**: Secure session management
- **File Upload Security**: Validated file types and sizes
- **Rate Limiting**: API endpoint protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PSR-12 coding standards for PHP
- Use TypeScript for all React components
- Write tests for new features
- Update documentation for API changes
- Follow semantic versioning

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support or questions:

- **Documentation**: Check the API documentation files
- **Issues**: Open an issue on GitHub
- **Email**: Contact the development team

## 🎯 Roadmap

### Upcoming Features

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Payment gateway integration
- [ ] Multi-language support
- [ ] Advanced reporting system
- [ ] Email marketing integration
- [ ] Live chat support

### Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added advanced filtering and search
- **v1.2.0** - Implemented role-based access control
- **v1.3.0** - Added analytics dashboard

---

**Built with ❤️ using Laravel and React**

_This project demonstrates modern full-stack development practices with a focus on user experience, performance, and maintainability._

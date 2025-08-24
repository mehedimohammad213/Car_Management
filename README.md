# 🚗 Car Management System - Environment Setup

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2 or higher**
- **Composer** (PHP package manager)
- **Node.js 16 or higher**
- **npm or yarn**
- **MySQL 8.0+ or PostgreSQL 13+**
- **Git**

## 🚀 Installation

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

### Environment Variables

Create a `.env` file in the Backend directory:

```env
APP_NAME="Car Management System"
APP_ENV=local
APP_KEY=your-generated-key
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=cms
DB_USERNAME=your_username
DB_PASSWORD=your_password

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Configuration

Update the API base URL in your frontend configuration:

```typescript
// src/config/api.ts
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";
```

## 🎯 Development Servers

1. **Backend API**: http://localhost:8000
2. **Frontend App**: http://localhost:3000

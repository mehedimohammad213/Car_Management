SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- categories (self-referential)
-- ---------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NULL,
  `parent_category_id` BIGINT UNSIGNED NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT 'active',
  `short_des` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `categories_parent_category_id_foreign` (`parent_category_id`),
  CONSTRAINT `categories_parent_category_id_foreign`
    FOREIGN KEY (`parent_category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- cars
-- ---------------------------------------------------------------------------
CREATE TABLE `cars` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` BIGINT UNSIGNED NULL,
  `subcategory_id` BIGINT UNSIGNED NULL,
  `ref_no` VARCHAR(32) NULL,
  `code` VARCHAR(50) NULL,
  `make` VARCHAR(64) NOT NULL,
  `model` VARCHAR(64) NOT NULL,
  `model_code` VARCHAR(32) NULL,
  `variant` VARCHAR(128) NULL,
  `year` SMALLINT NOT NULL,
  `reg_year_month` VARCHAR(10) NULL,
  `mileage_km` INT UNSIGNED NULL,
  `engine_cc` INT UNSIGNED NULL,
  `transmission` VARCHAR(32) NULL,
  `drive` VARCHAR(32) NULL,
  `steering` VARCHAR(16) NULL,
  `fuel` VARCHAR(32) NULL,
  `color` VARCHAR(64) NULL,
  `seats` TINYINT UNSIGNED NULL,
  `grade_overall` VARCHAR(10) NULL,
  `grade_exterior` VARCHAR(32) NULL,
  `grade_interior` VARCHAR(32) NULL,
  `price_amount` DECIMAL(12,2) NULL,
  `price_currency` CHAR(3) NOT NULL DEFAULT 'USD',
  `price_basis` VARCHAR(32) NULL,
  `fob_value_usd` DECIMAL(12,2) NULL,
  `freight_usd` DECIMAL(12,2) NULL,
  `chassis_no_masked` VARCHAR(32) NULL,
  `chassis_no_full` VARCHAR(64) NULL,
  `location` VARCHAR(128) NULL,
  `country_origin` VARCHAR(64) NULL,
  `status` VARCHAR(32) NULL,
  `package` VARCHAR(255) NULL,
  `body` VARCHAR(64) NULL,
  `type` VARCHAR(64) NULL,
  `engine_number` VARCHAR(64) NULL,
  `number_of_keys` INT NULL,
  `keys_feature` VARCHAR(255) NULL,
  `notes` TEXT NULL,
  `attached_file` VARCHAR(512) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cars_ref_no_unique` (`ref_no`),
  KEY `cars_subcategory_id_foreign` (`subcategory_id`),
  KEY `cars_category_id_foreign` (`category_id`),
  CONSTRAINT `cars_category_id_foreign`
    FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cars_subcategory_id_foreign`
    FOREIGN KEY (`subcategory_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- car_photos
-- ---------------------------------------------------------------------------
CREATE TABLE `car_photos` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `car_id` BIGINT UNSIGNED NOT NULL,
  `url` VARCHAR(512) NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_hidden` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `car_photos_car_id_is_primary_index` (`car_id`, `is_primary`),
  CONSTRAINT `car_photos_car_id_foreign`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- stocks (ENUM extended for MySQL in migration 2026_05_05)
-- ---------------------------------------------------------------------------
CREATE TABLE `stocks` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `car_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NULL,
  `status` ENUM(
    'available','sold','reserved','damaged','lost','stolen',
    'pending','in_transit','preorder'
  ) NOT NULL DEFAULT 'available',
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `stocks_car_id_foreign` (`car_id`),
  CONSTRAINT `stocks_car_id_foreign`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- car_details / car_sub_details
-- ---------------------------------------------------------------------------
CREATE TABLE `car_details` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `car_id` BIGINT UNSIGNED NOT NULL,
  `short_title` VARCHAR(255) NULL,
  `full_title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `images` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `car_details_car_id_foreign` (`car_id`),
  CONSTRAINT `car_details_car_id_foreign`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `car_sub_details` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `car_detail_id` BIGINT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `car_sub_details_car_detail_id_foreign` (`car_detail_id`),
  CONSTRAINT `car_sub_details_car_detail_id_foreign`
    FOREIGN KEY (`car_detail_id`) REFERENCES `car_details` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- users + auth scaffolding
-- ---------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `role` ENUM('admin','user') NOT NULL DEFAULT 'user',
  `email_verified_at` TIMESTAMP NULL,
  `password` VARCHAR(255) NOT NULL,
  `remember_token` VARCHAR(100) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_username_unique` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL PRIMARY KEY,
  `token` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sessions` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NULL,
  `ip_address` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `payload` LONGTEXT NOT NULL,
  `last_activity` INT NOT NULL,
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Sanctum
-- ---------------------------------------------------------------------------
CREATE TABLE `personal_access_tokens` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` VARCHAR(255) NOT NULL,
  `tokenable_id` BIGINT UNSIGNED NOT NULL,
  `name` TEXT NOT NULL,
  `token` VARCHAR(64) NOT NULL,
  `abilities` TEXT NULL,
  `last_used_at` TIMESTAMP NULL,
  `expires_at` TIMESTAMP NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`, `tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- cart / orders
-- ---------------------------------------------------------------------------
CREATE TABLE `carts` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `car_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `carts_user_id_foreign` (`user_id`),
  KEY `carts_car_id_foreign` (`car_id`),
  CONSTRAINT `carts_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carts_car_id_foreign`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `total_amount` DECIMAL(10,2) NOT NULL,
  `shipping_address` VARCHAR(255) NULL,
  `status` ENUM('pending','approved','shipped','delivered','canceled') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`),
  CONSTRAINT `orders_user_id_foreign`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `car_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_car_id_foreign` (`car_id`),
  CONSTRAINT `order_items_order_id_foreign`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_car_id_foreign`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `po_items` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `car_id` BIGINT UNSIGNED NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `notes` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `po_items_order_id_foreign` (`order_id`),
  KEY `po_items_car_id_foreign` (`car_id`),
  CONSTRAINT `po_items_order_id_foreign`
    FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `po_items_car_id_foreign`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- purchase_history (car_id moved to pivot car_purchase_history)
-- ---------------------------------------------------------------------------
CREATE TABLE `purchase_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `purchase_date` DATE NULL,
  `purchase_amount` DECIMAL(15,2) NULL,
  `foreign_amount` DECIMAL(15,2) NULL,
  `bdt_amount` DECIMAL(15,2) NULL,
  `currency_type` VARCHAR(255) NULL DEFAULT 'dollar',
  `govt_duty` VARCHAR(255) NULL,
  `cnf_amount` DECIMAL(15,2) NULL,
  `miscellaneous` VARCHAR(255) NULL,
  `hs_code` VARCHAR(64) NULL,
  `price_amount` DECIMAL(15,2) NULL,
  `price_basis` VARCHAR(64) NULL,
  `fob_value_usd` DECIMAL(15,2) NULL,
  `freight_usd` DECIMAL(15,2) NULL,
  `bid_price` DECIMAL(18,2) NULL,
  `ser_com` DECIMAL(18,2) NULL,
  `lc_date` DATE NULL,
  `lc_number` VARCHAR(255) NULL,
  `lc_bank_name` VARCHAR(255) NULL,
  `lc_bank_branch_name` VARCHAR(255) NULL,
  `lc_bank_branch_address` VARCHAR(255) NULL,
  `total_units_per_lc` VARCHAR(255) NULL,
  `bill_of_lading` VARCHAR(255) NULL,
  `invoice_number` VARCHAR(255) NULL,
  `export_certificate` VARCHAR(255) NULL,
  `export_certificate_translated` VARCHAR(255) NULL,
  `bill_of_exchange_amount` VARCHAR(255) NULL,
  `custom_duty_copy_3pages` VARCHAR(255) NULL,
  `cheque_copy` VARCHAR(255) NULL,
  `certificate` VARCHAR(255) NULL,
  `custom_one` VARCHAR(255) NULL,
  `custom_two` VARCHAR(255) NULL,
  `custom_three` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `car_purchase_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `car_id` BIGINT UNSIGNED NOT NULL,
  `purchase_history_id` BIGINT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `car_purchase_history_car_id_foreign` (`car_id`),
  KEY `car_purchase_history_purchase_history_id_foreign` (`purchase_history_id`),
  CONSTRAINT `car_purchase_history_car_id_foreign`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE CASCADE,
  CONSTRAINT `car_purchase_history_purchase_history_id_foreign`
    FOREIGN KEY (`purchase_history_id`) REFERENCES `purchase_history` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- payment_history / installments
-- ---------------------------------------------------------------------------
CREATE TABLE `payment_history` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `car_id` BIGINT UNSIGNED NULL,
  `showroom_name` VARCHAR(255) NULL,
  `wholesaler_address` VARCHAR(255) NULL,
  `purchase_amount` DECIMAL(15,2) NULL,
  `purchase_date` DATE NULL,
  `nid_number` VARCHAR(255) NULL,
  `customer_name` VARCHAR(255) NULL,
  `tin_certificate` VARCHAR(255) NULL,
  `customer_address` VARCHAR(255) NULL,
  `contact_number` VARCHAR(255) NULL,
  `email` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `payment_history_car_id_foreign` (`car_id`),
  CONSTRAINT `payment_history_car_id_foreign`
    FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `installments` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `payment_history_id` BIGINT UNSIGNED NOT NULL,
  `installment_date` DATE NULL,
  `description` VARCHAR(255) NULL,
  `amount` DECIMAL(15,2) NULL,
  `payment_method` ENUM('Bank','Cash') NULL,
  `bank_name` VARCHAR(255) NULL,
  `cheque_number` VARCHAR(255) NULL,
  `balance` DECIMAL(15,2) NULL,
  `remarks` VARCHAR(255) NULL,
  `status` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  KEY `installments_payment_history_id_foreign` (`payment_history_id`),
  CONSTRAINT `installments_payment_history_id_foreign`
    FOREIGN KEY (`payment_history_id`) REFERENCES `payment_history` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- queue / cache (Laravel default)
-- ---------------------------------------------------------------------------
CREATE TABLE `jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` TINYINT UNSIGNED NOT NULL,
  `reserved_at` INT UNSIGNED NULL,
  `available_at` INT UNSIGNED NOT NULL,
  `created_at` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `job_batches` (
  `id` VARCHAR(255) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `total_jobs` INT NOT NULL,
  `pending_jobs` INT NOT NULL,
  `failed_jobs` INT NOT NULL,
  `failed_job_ids` LONGTEXT NOT NULL,
  `options` MEDIUMTEXT NULL,
  `cancelled_at` INT NULL,
  `created_at` INT NOT NULL,
  `finished_at` INT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `failed_jobs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `connection` TEXT NOT NULL,
  `queue` TEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache` (
  `key` VARCHAR(255) NOT NULL PRIMARY KEY,
  `value` MEDIUMTEXT NOT NULL,
  `expiration` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cache_locks` (
  `key` VARCHAR(255) NOT NULL PRIMARY KEY,
  `owner` VARCHAR(255) NOT NULL,
  `expiration` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

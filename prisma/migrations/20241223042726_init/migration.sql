-- CreateTable
CREATE TABLE `categories` (
    `categories_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(50) NOT NULL,
    `category_type` VARCHAR(50) NOT NULL DEFAULT 'regular',
    `parent_id` INTEGER NULL,

    UNIQUE INDEX `category_name_UNIQUE`(`category_name`),
    PRIMARY KEY (`categories_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_categories` (
    `product_categories_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `fk_product_categories_category_id_idx`(`category_id`),
    INDEX `fk_product_categories_product_id_idx`(`product_id`),
    UNIQUE INDEX `index_product_id_category_id`(`product_id`, `category_id`),
    PRIMARY KEY (`product_categories_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_images` (
    `product_images_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `image_path` VARCHAR(255) NOT NULL,
    `order_sort` INTEGER NOT NULL DEFAULT 1,
    `alt_text` VARCHAR(255) NULL,
    `image_type` VARCHAR(20) NOT NULL,

    INDEX `fk_product_images_product_id_idx`(`product_id`),
    INDEX `idx_type_sort`(`order_sort`, `image_type`),
    PRIMARY KEY (`product_images_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_specs` (
    `product_specs_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `spec_value` VARCHAR(50) NOT NULL,
    `stock` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `color_text` VARCHAR(50) NULL,
    `color_square` VARCHAR(50) NULL,

    INDEX `fk_product_spec_product_id_idx`(`product_id`),
    PRIMARY KEY (`product_specs_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(100) NOT NULL,
    `original_price` DECIMAL(10, 2) NULL,
    `sale_price` DECIMAL(10, 2) NOT NULL,
    `product_sku` VARCHAR(50) NOT NULL,
    `total_sales` INTEGER NOT NULL DEFAULT 0,
    `status` TINYINT NOT NULL DEFAULT 1,
    `listed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `description` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `sku_UNIQUE`(`product_sku`),
    INDEX `idx_status`(`status`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deliver` (
    `id` INTEGER NOT NULL,
    `phone` VARCHAR(20) NULL,
    `recepient` VARCHAR(50) NOT NULL,
    `recepient_phone` VARCHAR(20) NOT NULL,
    `country` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `region` VARCHAR(100) NOT NULL,
    `address` TEXT NOT NULL,
    `owner` VARCHAR(50) NOT NULL,

    INDEX `fk_owner_userId_idx`(`owner`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `discount` (
    `discount_id` VARCHAR(50) NOT NULL,
    `dicription` TEXT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders_imformation` (
    `orders_id` BIGINT UNSIGNED NOT NULL,
    `orders_users_id` VARCHAR(50) NULL,
    `orders_status` ENUM('Pending', 'Completed', 'Cancelled') NOT NULL,
    `orders_created_date` DATETIME(0) NOT NULL,
    `orders_finished_date` DATETIME(0) NULL,
    `orders_deliver_id` INTEGER NULL,
    `orders_payment_id` INTEGER NULL,

    INDEX `fk_orders_deliver_idx`(`orders_deliver_id`),
    INDEX `fk_orders_user_idx`(`orders_users_id`),
    INDEX `fk_orders_payment_idx`(`orders_payment_id`),
    PRIMARY KEY (`orders_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews_table` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255) NOT NULL,
    `sku` INTEGER NULL,
    `comment` TEXT NULL,
    `comment_time` INTEGER NULL,

    UNIQUE INDEX `commentId_UNIQUE`(`product_id`),
    UNIQUE INDEX `userId_UNIQUE`(`user_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NULL,
    `phone` VARCHAR(20) NULL,
    `gender` VARCHAR(1) NOT NULL,
    `birthday` DATE NULL,
    `mobile_phone` VARCHAR(20) NULL,
    `from_store` VARCHAR(45) NULL,
    `introduced_by` VARCHAR(50) NULL,
    `password_hash` VARCHAR(255) NULL,
    `line_id` VARCHAR(100) NULL,
    `google_id` VARCHAR(100) NULL,

    UNIQUE INDEX `id_UNIQUE`(`id`),
    UNIQUE INDEX `userId_UNIQUE`(`userId`),
    UNIQUE INDEX `email_UNIQUE`(`email`),
    UNIQUE INDEX `phone_UNIQUE`(`phone`),
    INDEX `user_id`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cart` (
    `user_id` VARCHAR(50) NOT NULL,
    `product_id` VARCHAR(50) NOT NULL,
    `quantity` INTEGER NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishlists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wishlists_members_id` VARCHAR(50) NOT NULL,
    `wishlists_products_id` INTEGER NOT NULL,

    INDEX `fk_wishlists_products`(`wishlists_products_id`),
    INDEX `fk_wishlists_users_idx`(`wishlists_members_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `credit_card` (
    `id` INTEGER NOT NULL,
    `card_number` VARCHAR(16) NOT NULL,
    `owner_name` VARCHAR(50) NOT NULL,
    `expiration_date` VARCHAR(6) NOT NULL,
    `security_code` VARCHAR(3) NOT NULL,
    `owner` VARCHAR(50) NOT NULL,

    INDEX `userId_idx`(`owner`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_info` (
    `cuID` VARCHAR(50) NULL,
    `cuName` VARCHAR(50) NULL,
    `cuPhone` INTEGER NULL,
    `gender` VARCHAR(1) NULL,
    `UserID` VARCHAR(50) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deliver_pro_info` (
    `acName` VARCHAR(50) NULL,
    `acPhone` INTEGER NULL,
    `addr` VARCHAR(50) NULL,
    `city` VARCHAR(10) NULL,
    `postalCode` INTEGER NULL,
    `site` VARCHAR(50) NULL,
    `userID` VARCHAR(50) NULL,
    `delivrID` VARCHAR(50) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pay_info_table` (
    `cardID` VARCHAR(50) NULL,
    `cardName` VARCHAR(50) NULL,
    `efficentDate` DATE NULL,
    `securityCode` INTEGER NULL,
    `PayID` VARCHAR(50) NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_order` (
    `purchaseID` VARCHAR(50) NOT NULL,
    `DeliveryWay` VARCHAR(50) NULL,
    `DeliverySite` VARCHAR(50) NULL,
    `payWay` VARCHAR(50) NULL,
    `note` VARCHAR(50) NULL,
    `payID` VARCHAR(50) NULL,
    `cuID` VARCHAR(50) NULL,
    `DeliverID` VARCHAR(50) NULL,
    `puID` VARCHAR(50) NULL,

    PRIMARY KEY (`purchaseID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `purchase_product` (
    `pu_id` VARCHAR(50) NULL,
    `user_id` VARCHAR(50) NULL,
    `product_id` VARCHAR(50) NULL,
    `quantity` INTEGER NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shared_cart_users` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `shared_cart_group_id` VARCHAR(100) NOT NULL,
    `user_id` VARCHAR(50) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `fk_shared_cart_id_idx`(`shared_cart_group_id`),
    INDEX `fk_shared_cart_user_id_idx`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `shared_carts` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `group_id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(45) NULL,
    `product_id` INTEGER NULL,
    `quantity` INTEGER NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `status` BOOLEAN NOT NULL DEFAULT false,
    `completed_at` TIMESTAMP(0) NULL,
    `completed_by` VARCHAR(50) NULL,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,

    INDEX `idx_group_id`(`group_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `currency` VARCHAR(45) NOT NULL,
    `rate` DECIMAL(10, 5) NULL,
    `latestUpdateTime` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id_UNIQUE`(`id`),
    UNIQUE INDEX `currency_UNIQUE`(`currency`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_categories` ADD CONSTRAINT `fk_product_categories_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories`(`categories_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_categories` ADD CONSTRAINT `fk_product_categories_product_id` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_images` ADD CONSTRAINT `fk_product_images_product_id` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `product_specs` ADD CONSTRAINT `fk_product_spec_product_id` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `deliver` ADD CONSTRAINT `fk_deliver_owner_userId` FOREIGN KEY (`owner`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders_imformation` ADD CONSTRAINT `fk_orders_deliver` FOREIGN KEY (`orders_deliver_id`) REFERENCES `deliver`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders_imformation` ADD CONSTRAINT `fk_orders_payment` FOREIGN KEY (`orders_payment_id`) REFERENCES `credit_card`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `orders_imformation` ADD CONSTRAINT `fk_orders_user` FOREIGN KEY (`orders_users_id`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `fk_wishlists_products` FOREIGN KEY (`wishlists_products_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `wishlists` ADD CONSTRAINT `fk_wishlists_users` FOREIGN KEY (`wishlists_members_id`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `credit_card` ADD CONSTRAINT `fk_creditCard_owner_userId` FOREIGN KEY (`owner`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `shared_cart_users` ADD CONSTRAINT `fk_shared_cart_user_id` FOREIGN KEY (`user_id`) REFERENCES `users`(`userId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

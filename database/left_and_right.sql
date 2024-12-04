-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: left_and_right
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `categories_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  `category_type` varchar(50) NOT NULL DEFAULT 'regular',
  `parent_id` int DEFAULT NULL,
  PRIMARY KEY (`categories_id`),
  UNIQUE KEY `category_name_UNIQUE` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'戒指 / Rings','regular',NULL),(2,'熱銷商品 / B.Sellers','regular',NULL),(3,'Kurt Wu 插畫家聯名','promote',NULL);
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `credit_card`
--

DROP TABLE IF EXISTS `credit_card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `credit_card` (
  `id` int NOT NULL,
  `card_number` varchar(16) NOT NULL,
  `owner_name` varchar(50) NOT NULL,
  `expiration_date` varchar(6) NOT NULL,
  `security_code` varchar(3) NOT NULL,
  `owner` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userId_idx` (`owner`),
  CONSTRAINT `fk_owner_userId` FOREIGN KEY (`owner`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `credit_card`
--

LOCK TABLES `credit_card` WRITE;
/*!40000 ALTER TABLE `credit_card` DISABLE KEYS */;
/*!40000 ALTER TABLE `credit_card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliver`
--

DROP TABLE IF EXISTS `deliver`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliver` (
  `id` int NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `recepient` varchar(50) NOT NULL,
  `recepient_phone` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `region` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `owner` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_owner_userId_idx` (`owner`),
  CONSTRAINT `fk_deliver_owner_userId` FOREIGN KEY (`owner`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliver`
--

LOCK TABLES `deliver` WRITE;
/*!40000 ALTER TABLE `deliver` DISABLE KEYS */;
/*!40000 ALTER TABLE `deliver` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_imformation`
--

DROP TABLE IF EXISTS `orders_imformation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_imformation` (
  `orders_id` bigint unsigned NOT NULL,
  `orders_email` varchar(255) DEFAULT NULL,
  `orders_created_date` datetime NOT NULL,
  `orders_status` enum('Pending','Completed','Cancelled') NOT NULL,
  `orders_finished_date` datetime DEFAULT NULL,
  PRIMARY KEY (`orders_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_imformation`
--

LOCK TABLES `orders_imformation` WRITE;
/*!40000 ALTER TABLE `orders_imformation` DISABLE KEYS */;
INSERT INTO `orders_imformation` VALUES (0,'kkoma@gmail.com','2024-12-01 00:07:11','Pending','2024-12-01 00:07:55');
/*!40000 ALTER TABLE `orders_imformation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_categories` (
  `product_categories_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`product_categories_id`),
  UNIQUE KEY `index_product_id_category_id` (`product_id`,`category_id`),
  KEY `fk_product_categories_product_id_idx` (`product_id`) /*!80000 INVISIBLE */,
  KEY `fk_product_categories_category_id_idx` (`category_id`) /*!80000 INVISIBLE */,
  CONSTRAINT `fk_product_categories_category_id` FOREIGN KEY (`category_id`) REFERENCES `categories` (`categories_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_product_categories_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_categories`
--

LOCK TABLES `product_categories` WRITE;
/*!40000 ALTER TABLE `product_categories` DISABLE KEYS */;
INSERT INTO `product_categories` VALUES (1,1,1),(2,1,2),(4,11,1),(5,12,1),(6,13,1),(7,14,1),(8,15,1),(9,16,1),(10,17,1),(11,18,1),(12,19,1),(13,20,1),(14,21,1),(15,22,1),(16,23,1),(17,24,1),(18,25,1),(19,26,1),(20,27,1),(21,28,1),(22,29,1),(23,30,1),(24,31,1),(25,32,1),(26,33,1),(27,34,1),(28,35,1);
/*!40000 ALTER TABLE `product_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `product_images_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `order_sort` int NOT NULL DEFAULT '1',
  `alt_text` varchar(255) DEFAULT NULL,
  `image_type` varchar(20) NOT NULL COMMENT 'main, description',
  PRIMARY KEY (`product_images_id`),
  KEY `fk_product_images_product_id_idx` (`product_id`),
  KEY `idx_type_sort` (`order_sort`,`image_type`),
  CONSTRAINT `fk_product_images_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=272 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (12,11,'./images/R002-main-1.webp',1,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','main'),(13,11,'./images/R002-main-2.webp',2,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','main'),(14,11,'./images/R002-main-3.webp',3,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','main'),(15,11,'./images/R002-main-4.webp',4,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','main'),(16,11,'./images/R002-main-5.webp',5,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','main'),(17,11,'./images/R002-des-1.jpg',1,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','description'),(18,11,'./images/R002-des-2.jpg',2,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','description'),(19,11,'./images/R002-des-3.jpg',3,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','description'),(20,11,'./images/R002-des-4.jpg',4,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','description'),(21,11,'./images/R002-des-5.jpg',5,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring','description'),(22,1,'./images/R001-main-1.webp',1,'極簡定律戒指 / 男款 / Minimalist Law Ring','main'),(23,1,'./images/R001-main-2.webp',2,'極簡定律戒指 / 男款 / Minimalist Law Ring','main'),(24,1,'./images/R001-main-3.webp',3,'極簡定律戒指 / 男款 / Minimalist Law Ring','main'),(25,1,'./images/R001-main-4.webp',4,'極簡定律戒指 / 男款 / Minimalist Law Ring','main'),(26,1,'./images/R001-main-5.webp',5,'極簡定律戒指 / 男款 / Minimalist Law Ring','main'),(27,1,'./images/R001-des-1.webp',1,'極簡定律戒指 / 男款 / Minimalist Law Ring','description'),(28,1,'./images/R001-des-2.webp',2,'極簡定律戒指 / 男款 / Minimalist Law Ring','description'),(29,1,'./images/R001-des-3.webp',3,'極簡定律戒指 / 男款 / Minimalist Law Ring','description'),(30,1,'./images/R001-des-4.webp',4,'極簡定律戒指 / 男款 / Minimalist Law Ring','description'),(31,1,'./images/R001-des-5.webp',5,'極簡定律戒指 / 男款 / Minimalist Law Ring','description'),(32,12,'./images/R003-main-1.webp',1,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','main'),(33,12,'./images/R003-main-2.webp',2,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','main'),(34,12,'./images/R003-main-3.webp',3,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','main'),(35,12,'./images/R003-main-4.webp',4,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','main'),(36,12,'./images/R003-main-5.webp',5,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','main'),(37,12,'./images/R003-des-1.jpg',1,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','description'),(38,12,'./images/R003-des-2.jpg',2,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','description'),(39,12,'./images/R003-des-3.jpg',3,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','description'),(40,12,'./images/R003-des-4.jpg',4,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','description'),(41,12,'./images/R003-des-5.jpg',5,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring','description'),(42,13,'./images/R004-main-1.webp',1,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','main'),(43,13,'./images/R004-main-2.webp',2,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','main'),(44,13,'./images/R004-main-3.webp',3,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','main'),(45,13,'./images/R004-main-4.webp',4,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','main'),(46,13,'./images/R004-main-5.webp',5,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','main'),(47,13,'./images/R004-des-1.jpg',1,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','description'),(48,13,'./images/R004-des-2.jpg',2,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','description'),(49,13,'./images/R004-des-3.jpg',3,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','description'),(50,13,'./images/R004-des-4.jpg',4,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','description'),(51,13,'./images/R004-des-5.jpg',5,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring','description'),(52,14,'./images/R005-main-1.webp',1,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','main'),(53,14,'./images/R005-main-2.webp',2,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','main'),(54,14,'./images/R005-main-3.webp',3,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','main'),(55,14,'./images/R005-main-4.webp',4,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','main'),(56,14,'./images/R005-main-5.webp',5,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','main'),(57,14,'./images/R005-des-1.jpg',1,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','description'),(58,14,'./images/R005-des-2.jpg',2,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','description'),(59,14,'./images/R005-des-3.jpg',3,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','description'),(60,14,'./images/R005-des-4.jpg',4,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','description'),(61,14,'./images/R005-des-5.jpg',5,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring','description'),(62,15,'./images/R006-main-1.webp',1,'[純銀] 簡約之星戒指 / Simple Star Ring','main'),(63,15,'./images/R006-main-2.webp',2,'[純銀] 簡約之星戒指 / Simple Star Ring','main'),(64,15,'./images/R006-main-3.webp',3,'[純銀] 簡約之星戒指 / Simple Star Ring','main'),(65,15,'./images/R006-main-4.webp',4,'[純銀] 簡約之星戒指 / Simple Star Ring','main'),(66,15,'./images/R006-main-5.webp',5,'[純銀] 簡約之星戒指 / Simple Star Ring','main'),(67,15,'./images/R006-des-1.jpg',1,'[純銀] 簡約之星戒指 / Simple Star Ring','description'),(68,15,'./images/R006-des-2.jpg',2,'[純銀] 簡約之星戒指 / Simple Star Ring','description'),(69,15,'./images/R006-des-3.jpg',3,'[純銀] 簡約之星戒指 / Simple Star Ring','description'),(70,15,'./images/R006-des-4.jpg',4,'[純銀] 簡約之星戒指 / Simple Star Ring','description'),(71,15,'./images/R006-des-5.jpg',5,'[純銀] 簡約之星戒指 / Simple Star Ring','description'),(72,16,'./images/R007-main-1.webp',1,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','main'),(73,16,'./images/R007-main-2.webp',2,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','main'),(74,16,'./images/R007-main-3.webp',3,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','main'),(75,16,'./images/R007-main-4.webp',4,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','main'),(76,16,'./images/R007-main-5.webp',5,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','main'),(77,16,'./images/R007-des-1.jpg',1,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','description'),(78,16,'./images/R007-des-2.jpg',2,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','description'),(79,16,'./images/R007-des-3.jpg',3,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','description'),(80,16,'./images/R007-des-4.jpg',4,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','description'),(81,16,'./images/R007-des-5.jpg',5,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring','description'),(82,17,'./images/R008-main-1.webp',1,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','main'),(83,17,'./images/R008-main-2.webp',2,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','main'),(84,17,'./images/R008-main-3.webp',3,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','main'),(85,17,'./images/R008-main-4.webp',4,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','main'),(86,17,'./images/R008-main-5.webp',5,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','main'),(87,17,'./images/R008-des-1.jpg',1,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','description'),(88,17,'./images/R008-des-2.jpg',2,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','description'),(89,17,'./images/R008-des-3.jpg',3,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','description'),(90,17,'./images/R008-des-4.jpg',4,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','description'),(91,17,'./images/R008-des-5.jpg',5,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring','description'),(92,18,'./images/R009-main-1.webp',1,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','main'),(93,18,'./images/R009-main-2.webp',2,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','main'),(94,18,'./images/R009-main-3.webp',3,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','main'),(95,18,'./images/R009-main-4.webp',4,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','main'),(96,18,'./images/R009-main-5.webp',5,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','main'),(97,18,'./images/R009-des-1.jpg',1,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','description'),(98,18,'./images/R009-des-2.jpg',2,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','description'),(99,18,'./images/R009-des-3.jpg',3,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','description'),(100,18,'./images/R009-des-4.jpg',4,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','description'),(101,18,'./images/R009-des-5.jpg',5,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring','description'),(102,19,'./images/R010-main-1.webp',1,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','main'),(103,19,'./images/R010-main-2.webp',2,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','main'),(104,19,'./images/R010-main-3.webp',3,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','main'),(105,19,'./images/R010-main-4.webp',4,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','main'),(106,19,'./images/R010-main-5.webp',5,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','main'),(107,19,'./images/R010-des-1.jpg',1,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','description'),(108,19,'./images/R010-des-2.jpg',2,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','description'),(109,19,'./images/R010-des-3.jpg',3,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','description'),(110,19,'./images/R010-des-4.jpg',4,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','description'),(111,19,'./images/R010-des-5.jpg',5,'[預購] 妳是我的戒指組 / You Are Mine Ring Set','description'),(112,20,'./images/R011-main-1.webp',1,'夜空星河戒指 / Night Sky Galaxy Ring','main'),(113,20,'./images/R011-main-2.webp',2,'夜空星河戒指 / Night Sky Galaxy Ring','main'),(114,20,'./images/R011-main-3.webp',3,'夜空星河戒指 / Night Sky Galaxy Ring','main'),(115,20,'./images/R011-main-4.webp',4,'夜空星河戒指 / Night Sky Galaxy Ring','main'),(116,20,'./images/R011-main-5.webp',5,'夜空星河戒指 / Night Sky Galaxy Ring','main'),(117,20,'./images/R011-des-1.jpg',1,'夜空星河戒指 / Night Sky Galaxy Ring','description'),(118,20,'./images/R011-des-2.jpg',2,'夜空星河戒指 / Night Sky Galaxy Ring','description'),(119,20,'./images/R011-des-3.jpg',3,'夜空星河戒指 / Night Sky Galaxy Ring','description'),(120,20,'./images/R011-des-4.jpg',4,'夜空星河戒指 / Night Sky Galaxy Ring','description'),(121,20,'./images/R011-des-5.jpg',5,'夜空星河戒指 / Night Sky Galaxy Ring','description'),(122,21,'./images/R012-main-1.webp',1,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','main'),(123,21,'./images/R012-main-2.webp',2,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','main'),(124,21,'./images/R012-main-3.webp',3,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','main'),(125,21,'./images/R012-main-4.webp',4,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','main'),(126,21,'./images/R012-main-5.webp',5,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','main'),(127,21,'./images/R012-des-1.jpg',1,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','description'),(128,21,'./images/R012-des-2.jpg',2,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','description'),(129,21,'./images/R012-des-3.jpg',3,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','description'),(130,21,'./images/R012-des-4.jpg',4,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','description'),(131,21,'./images/R012-des-5.jpg',5,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace','description'),(132,22,'./images/R013-main-1.webp',1,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','main'),(133,22,'./images/R013-main-2.webp',2,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','main'),(134,22,'./images/R013-main-3.webp',3,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','main'),(135,22,'./images/R013-main-4.webp',4,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','main'),(136,22,'./images/R013-main-5.webp',5,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','main'),(137,22,'./images/R013-des-1.jpg',1,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','description'),(138,22,'./images/R013-des-2.jpg',2,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','description'),(139,22,'./images/R013-des-3.jpg',3,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','description'),(140,22,'./images/R013-des-4.jpg',4,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','description'),(141,22,'./images/R013-des-5.jpg',5,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring','description'),(142,23,'./images/R014-main-1.webp',1,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','main'),(143,23,'./images/R014-main-2.webp',2,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','main'),(144,23,'./images/R014-main-3.webp',3,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','main'),(145,23,'./images/R014-main-4.webp',4,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','main'),(146,23,'./images/R014-main-5.webp',5,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','main'),(147,23,'./images/R014-des-1.jpg',1,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','description'),(148,23,'./images/R014-des-2.jpg',2,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','description'),(149,23,'./images/R014-des-3.jpg',3,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','description'),(150,23,'./images/R014-des-4.jpg',4,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','description'),(151,23,'./images/R014-des-5.jpg',5,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set','description'),(152,24,'./images/R015-main-1.webp',1,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','main'),(153,24,'./images/R015-main-2.webp',2,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','main'),(154,24,'./images/R015-main-3.webp',3,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','main'),(155,24,'./images/R015-main-4.webp',4,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','main'),(156,24,'./images/R015-main-5.webp',5,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','main'),(157,24,'./images/R015-des-1.jpg',1,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','description'),(158,24,'./images/R015-des-2.jpg',2,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','description'),(159,24,'./images/R015-des-3.jpg',3,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','description'),(160,24,'./images/R015-des-4.jpg',4,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','description'),(161,24,'./images/R015-des-5.jpg',5,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring','description'),(162,25,'./images/R016-main-1.webp',1,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','main'),(163,25,'./images/R016-main-2.webp',2,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','main'),(164,25,'./images/R016-main-3.webp',3,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','main'),(165,25,'./images/R016-main-4.webp',4,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','main'),(166,25,'./images/R016-main-5.webp',5,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','main'),(167,25,'./images/R016-des-1.jpg',1,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','description'),(168,25,'./images/R016-des-2.jpg',2,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','description'),(169,25,'./images/R016-des-3.jpg',3,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','description'),(170,25,'./images/R016-des-4.jpg',4,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','description'),(171,25,'./images/R016-des-5.jpg',5,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring','description'),(172,26,'./images/R017-main-1.webp',1,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','main'),(173,26,'./images/R017-main-2.webp',2,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','main'),(174,26,'./images/R017-main-3.webp',3,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','main'),(175,26,'./images/R017-main-4.webp',4,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','main'),(176,26,'./images/R017-main-5.webp',5,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','main'),(177,26,'./images/R017-des-1.jpg',1,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','description'),(178,26,'./images/R017-des-2.jpg',2,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','description'),(179,26,'./images/R017-des-3.jpg',3,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','description'),(180,26,'./images/R017-des-4.jpg',4,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','description'),(181,26,'./images/R017-des-5.jpg',5,'夢幻蝴蝶結戒指 / Fantasy Bow Ring','description'),(182,27,'./images/R018-main-1.webp',1,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','main'),(183,27,'./images/R018-main-2.webp',2,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','main'),(184,27,'./images/R018-main-3.webp',3,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','main'),(185,27,'./images/R018-main-4.webp',4,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','main'),(186,27,'./images/R018-main-5.webp',5,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','main'),(187,27,'./images/R018-des-1.jpg',1,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','description'),(188,27,'./images/R018-des-2.jpg',2,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','description'),(189,27,'./images/R018-des-3.jpg',3,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','description'),(190,27,'./images/R018-des-4.jpg',4,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','description'),(191,27,'./images/R018-des-5.jpg',5,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring','description'),(192,28,'./images/R019-main-1.webp',1,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','main'),(193,28,'./images/R019-main-2.webp',2,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','main'),(194,28,'./images/R019-main-3.webp',3,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','main'),(195,28,'./images/R019-main-4.webp',4,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','main'),(196,28,'./images/R019-main-5.webp',5,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','main'),(197,28,'./images/R019-des-1.jpg',1,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','description'),(198,28,'./images/R019-des-2.jpg',2,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','description'),(199,28,'./images/R019-des-3.jpg',3,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','description'),(200,28,'./images/R019-des-4.jpg',4,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','description'),(201,28,'./images/R019-des-5.jpg',5,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring','description'),(202,29,'./images/R020-main-1.webp',1,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','main'),(203,29,'./images/R020-main-2.webp',2,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','main'),(204,29,'./images/R020-main-3.webp',3,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','main'),(205,29,'./images/R020-main-4.webp',4,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','main'),(206,29,'./images/R020-main-5.webp',5,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','main'),(207,29,'./images/R020-des-1.jpg',1,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','description'),(208,29,'./images/R020-des-2.jpg',2,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','description'),(209,29,'./images/R020-des-3.jpg',3,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','description'),(210,29,'./images/R020-des-4.jpg',4,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','description'),(211,29,'./images/R020-des-5.jpg',5,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring','description'),(212,30,'./images/R021-main-1.webp',1,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','main'),(213,30,'./images/R021-main-2.webp',2,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','main'),(214,30,'./images/R021-main-3.webp',3,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','main'),(215,30,'./images/R021-main-4.webp',4,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','main'),(216,30,'./images/R021-main-5.webp',5,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','main'),(217,30,'./images/R021-des-1.jpg',1,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','description'),(218,30,'./images/R021-des-2.jpg',2,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','description'),(219,30,'./images/R021-des-3.jpg',3,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','description'),(220,30,'./images/R021-des-4.jpg',4,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','description'),(221,30,'./images/R021-des-5.jpg',5,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring','description'),(222,31,'./images/R022-main-1.webp',1,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','main'),(223,31,'./images/R022-main-2.webp',2,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','main'),(224,31,'./images/R022-main-3.webp',3,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','main'),(225,31,'./images/R022-main-4.webp',4,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','main'),(226,31,'./images/R022-main-5.webp',5,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','main'),(227,31,'./images/R022-des-1.jpg',1,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','description'),(228,31,'./images/R022-des-2.jpg',2,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','description'),(229,31,'./images/R022-des-3.jpg',3,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','description'),(230,31,'./images/R022-des-4.jpg',4,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','description'),(231,31,'./images/R022-des-5.jpg',5,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set','description'),(232,32,'./images/R023-main-1.webp',1,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','main'),(233,32,'./images/R023-main-2.webp',2,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','main'),(234,32,'./images/R023-main-3.webp',3,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','main'),(235,32,'./images/R023-main-4.webp',4,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','main'),(236,32,'./images/R023-main-5.webp',5,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','main'),(237,32,'./images/R023-des-1.jpg',1,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','description'),(238,32,'./images/R023-des-2.jpg',2,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','description'),(239,32,'./images/R023-des-3.jpg',3,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','description'),(240,32,'./images/R023-des-4.jpg',4,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','description'),(241,32,'./images/R023-des-5.jpg',5,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring','description'),(242,33,'./images/R024-main-1.webp',1,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','main'),(243,33,'./images/R024-main-2.webp',2,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','main'),(244,33,'./images/R024-main-3.webp',3,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','main'),(245,33,'./images/R024-main-4.webp',4,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','main'),(246,33,'./images/R024-main-5.webp',5,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','main'),(247,33,'./images/R024-des-1.jpg',1,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','description'),(248,33,'./images/R024-des-2.jpg',2,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','description'),(249,33,'./images/R024-des-3.jpg',3,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','description'),(250,33,'./images/R024-des-4.jpg',4,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','description'),(251,33,'./images/R024-des-5.jpg',5,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring','description'),(252,34,'./images/R025-main-1.webp',1,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','main'),(253,34,'./images/R025-main-2.webp',2,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','main'),(254,34,'./images/R025-main-3.webp',3,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','main'),(255,34,'./images/R025-main-4.webp',4,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','main'),(256,34,'./images/R025-main-5.webp',5,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','main'),(257,34,'./images/R025-des-1.jpg',1,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','description'),(258,34,'./images/R025-des-2.jpg',2,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','description'),(259,34,'./images/R025-des-3.jpg',3,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','description'),(260,34,'./images/R025-des-4.jpg',4,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','description'),(261,34,'./images/R025-des-5.jpg',5,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring','description'),(262,35,'./images/R026-main-1.webp',1,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','main'),(263,35,'./images/R026-main-2.webp',2,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','main'),(264,35,'./images/R026-main-3.webp',3,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','main'),(265,35,'./images/R026-main-4.webp',4,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','main'),(266,35,'./images/R026-main-5.webp',5,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','main'),(267,35,'./images/R026-des-1.jpg',1,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','description'),(268,35,'./images/R026-des-2.jpg',2,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','description'),(269,35,'./images/R026-des-3.jpg',3,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','description'),(270,35,'./images/R026-des-4.jpg',4,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','description'),(271,35,'./images/R026-des-5.jpg',5,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring','description');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_specs`
--

DROP TABLE IF EXISTS `product_specs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_specs` (
  `product_specs_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `spec_value` varchar(50) NOT NULL,
  `stock` int unsigned NOT NULL DEFAULT '0',
  `color_text` varchar(50) DEFAULT NULL,
  `color_square` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`product_specs_id`),
  KEY `fk_product_spec_product_id_idx` (`product_id`),
  CONSTRAINT `fk_product_spec_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_specs`
--

LOCK TABLES `product_specs` WRITE;
/*!40000 ALTER TABLE `product_specs` DISABLE KEYS */;
INSERT INTO `product_specs` VALUES (1,1,'內圍直徑 1.8 cm (#14)',30,NULL,NULL),(2,1,'內圍直徑 1.9 cm (#16)',25,NULL,NULL),(4,11,'standard',50,NULL,NULL),(5,12,'內圍直徑 1.6 cm (#11)',28,NULL,NULL),(6,12,'內圍直徑 1.75 cm (#13)',32,NULL,NULL),(7,13,'standard',50,NULL,NULL),(8,14,'standard',50,NULL,NULL),(9,15,'standard',50,NULL,NULL),(10,16,'standard',50,NULL,NULL),(11,17,'standard',50,NULL,NULL),(12,18,'standard',50,NULL,NULL),(13,19,'standard',50,NULL,NULL),(14,20,'standard',50,NULL,NULL),(15,21,'standard',50,NULL,NULL),(16,22,'standard',50,NULL,NULL),(17,23,'standard',50,NULL,NULL),(18,24,'standard',50,NULL,NULL),(19,25,'standard',50,NULL,NULL),(20,26,'standard',50,NULL,NULL),(21,27,'standard',50,NULL,NULL),(22,28,'standard',50,NULL,NULL),(23,29,'standard',50,NULL,NULL),(24,30,'standard',50,NULL,NULL),(25,31,'standard',50,NULL,NULL),(26,32,'standard',50,NULL,NULL),(27,33,'standard',50,NULL,NULL),(28,34,'內圍直徑 1.65 cm (#11)',32,NULL,NULL),(29,34,'內圍直徑 1.75 cm (#13)',5,NULL,NULL),(30,34,'內圍直徑 1.85 cm (#15)',28,NULL,NULL),(31,34,'內圍直徑 1.95 cm (#17)',0,NULL,NULL),(32,35,'standard',50,NULL,NULL);
/*!40000 ALTER TABLE `product_specs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `sale_price` decimal(10,2) NOT NULL,
  `product_sku` varchar(50) NOT NULL,
  `total_sales` int NOT NULL DEFAULT '0',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '1: 上架中, 0: 下架, -1: 已刪除',
  `listed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `sku_UNIQUE` (`product_sku`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'極簡定律戒指 / 男款 / Minimalist Law Ring',360.00,310.00,'R001',33,1,'2024-11-28 07:36:57','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質： 銅 \n● 戒指內圍直徑SIZE約：1.8 cm, 1.9 cm / 國際戒圍：#14, #16\n● 單件販售','2024-11-28 07:36:57'),(11,'[官網限定] 貓咪愛吃魚戒指 / Cat And Fish Ring',180.00,170.00,'R002',28,1,'2024-11-30 01:53:37','預購商品預計7-15天出貨，待商品到貨與現貨合併寄出\n● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：鋯石 / 白銅＋銀 (保色電鍍)\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12 (可微調)\n● 戒指重量約：1.8 g\n● 單件販售','2024-11-30 01:53:37'),(12,'[預購] 極簡定律戒指 / 女款 / Minimalist Law Ring',360.00,310.00,'R003',28,1,'2024-11-30 02:11:26','預購商品預計15-30天出貨，待商品到貨與現貨合併寄出\n● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀 / 鋯石\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 戒指重量約：1.5 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:11:26'),(13,'[預購] [純銀] 托勒密星團戒指 / Ptolemaic Cluster Ring',280.00,160.00,'R004',28,1,'2024-11-30 02:18:18','預購商品預計15-30天出貨，待商品到貨與現貨合併寄出\n● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀 / 鋯石\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 戒指重量約：1.5 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:18:18'),(14,'[預購] [純銀] 心的波動尾戒/關節戒1.4 / 2色 / Fluctuation Of Heart 1.4 Ring',297.00,160.00,'R005',28,1,'2024-11-30 02:26:34','預購商品預計7-25天出貨，待商品到貨與現貨合併寄出\n● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.4 cm / 國際戒圍：#6\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:26:34'),(15,'[純銀] 簡約之星戒指 / Simple Star Ring',550.00,160.00,'R006',28,1,'2024-11-30 02:28:29','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:28:29'),(16,'[官網限定] 蝴蝶結心願戒指 / Bow Wish Ring',280.00,160.00,'R007',28,1,'2024-11-30 02:30:06','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:30:06'),(17,'[純銀] 國王的愛妃戒指 / King\'s Concubine Ring',352.00,160.00,'R008',28,1,'2024-11-30 02:30:36','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:30:36'),(18,'[採用施華洛世奇水晶/純銀] 悠長愛戀戒指1.7 / 12色 / Crystals from Swarovski / Long Long Love 1.7 Ring',429.00,385.00,'R009',28,1,'2024-11-30 02:31:18','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:31:18'),(19,'[預購] 妳是我的戒指組 / You Are Mine Ring Set',460.00,160.00,'R010',28,1,'2024-11-30 02:38:01','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:38:01'),(20,'夜空星河戒指 / Night Sky Galaxy Ring',270.00,160.00,'R011',28,1,'2024-11-30 02:38:43','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:38:43'),(21,'[天然石] 守護未來鍊戒 / 3色 / Guard The Future Necklace',330.00,160.00,'R012',28,1,'2024-11-30 02:40:30','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:40:30'),(22,'[純銀] 櫻花秘境尾戒 / 2色 / Sakura Secret Ring',330.00,160.00,'R013',28,1,'2024-11-30 02:41:05','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:41:05'),(23,'[純銀] 深情告白情侶戒指組 / Affectionate Confession Ring Set',520.00,330.00,'R014',28,1,'2024-11-30 02:41:36','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:41:36'),(24,'[預購] [純銀] 春之慶典尾戒 / 2 size / Celebration Of Spring Ring',300.00,160.00,'R015',28,1,'2024-11-30 02:41:58','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:41:58'),(25,'[純銀/海藍寶晶石/白貝天然石] 安定如意鍊戒 / Stable And Wishful Ring',352.00,160.00,'R016',28,1,'2024-11-30 02:42:34','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:42:34'),(26,'夢幻蝴蝶結戒指 / Fantasy Bow Ring',300.00,160.00,'R017',28,1,'2024-11-30 02:45:24','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:45:24'),(27,'[預購] [純銀] 星際訊息戒指 / Interstellar Message Ring',520.00,160.00,'R018',28,1,'2024-11-30 02:45:58','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:45:58'),(28,'[郁欣設計款/鋼飾] 自由譜線戒指 / 2色 / 3 size / Free Spectral Line Ring',813.00,650.00,'R019',28,1,'2024-11-30 02:46:31','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:46:31'),(29,'[Nina自訂款] 粉嫩小花戒指 / 2 size / Colorful Flowers Ring',363.00,290.00,'R020',28,1,'2024-11-30 02:47:06','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:47:06'),(30,'[Nina自訂/孩童款] 童趣塗鴉戒指 / 2色 / 2 size / Childlike Graffiti Ring',1.00,850.00,'R021',28,1,'2024-11-30 02:47:23','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:47:23'),(31,'[預購] [Kurt聯名] [鋼飾] Kurt喜Kurt恨戒指組 / 2色 / 3 size / Kurt Gratifying Hateful Ring Set',1.00,1.00,'R022',28,1,'2024-11-30 02:54:39','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:54:39'),(32,'[預購] [Kurt聯名] 愛心Emoji戒指 / 3 size / Love Emoji Ring',1.00,850.00,'R023',28,1,'2024-11-30 02:55:42','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:55:42'),(33,'[預購] [Kurt聯名] [鋼飾] 心Kurt碎了戒指 / 4 size / Kurt Heartbreak Ring',1.00,890.00,'R024',28,1,'2024-11-30 02:56:07','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:56:07'),(34,'[預購] [Kurt聯名] 翻臉如翻書戒指 / 4 size / Kurt Flip Ring',1.00,1.00,'R025',28,1,'2024-11-30 02:56:29','● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:56:29'),(35,'[預購] [Kurt聯名] 和藹Kurt親戒指 / 2色 / Kurt Amiable Ring',1.00,890.00,'R026',28,1,'2024-11-30 02:59:42','● BONNY&READ飾品與Kurt Wu共同開發\n● 提供30日退換貨服務，請詳閱「售後服務」\n● 商品材質：S925低敏純銀\n● 戒指內圍直徑SIZE約：1.7 cm / 國際戒圍：#12\n● 可微調範圍約±0.05cm，超過可能會造成戒指變形或斷裂\n● 純銀重量約：1.9 g\n● 單件販售\n● 純銀飾品若無佩戴時，請先保持乾燥狀態，再放置飾品盒或是夾鏈袋乾燥陰涼處保存，避免氧化發黑。','2024-11-30 02:59:42');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(1) NOT NULL,
  `birthday` date DEFAULT NULL,
  `mobile_phone` varchar(20) DEFAULT NULL,
  `from_store` varchar(45) DEFAULT NULL,
  `introduced_by` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `line_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `userId_UNIQUE` (`userId`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  KEY `user_id` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,10001,'Fakerfake','fakerfake@gmail.com','0911222333','m',NULL,NULL,NULL,NULL,'faker',NULL),(2,10002,'Onerfake','onerfake@gmail.com','0922333444','m',NULL,NULL,NULL,NULL,'oner',NULL),(3,10003,'Doranfake','doranfake@gmail.com','0933444555','m',NULL,NULL,NULL,NULL,'doran',NULL),(4,10004,'Gumayusifake','guriafake@gmail.com','0944555666','m',NULL,NULL,NULL,NULL,'gumayusi',NULL),(5,10005,'Keriafake','keriafake@gmail.com','0955666777','m',NULL,NULL,NULL,NULL,'keria',NULL),(6,NULL,'zeusfake','zeusfake@gmail.com',NULL,'m',NULL,NULL,NULL,NULL,'$2b$10$ZFZMQMwepfnUHz.JYgPgSeX71jB0BBioS7KHl0wtWCe03CHey7mwi',NULL),(7,100051,'kkoma','kkoma@gmail.com',NULL,'m',NULL,NULL,NULL,NULL,'$2b$10$tJhE3SV6vuFxa/R1YThmwedwp/Vl3qw4Q66ud8RhdjEQ72cOilpu6',NULL),(8,100052,'faker','faker@gmail.com',NULL,'m',NULL,NULL,NULL,NULL,'$2b$10$pybNpRSmSEQVO9z.uvucvuHRfWhh1Z5mWmiQW4gWgSSBoSmZSt1uu',NULL),(9,100053,'oner','oner@gmail.com',NULL,'m',NULL,NULL,NULL,NULL,'$2b$10$/cMwlrlvB1jD5bUmt5aHuu1V8v3HVw0/nMa.Qjksp.SdkgfgBa7fq',NULL),(10,100054,'gumayusi','guria@gmail.com',NULL,'m',NULL,NULL,NULL,NULL,'$2b$10$ldw6vpriNTiBOAmWoK0T.ucR1OYos6yNteMJKS6ZRvDRdWv1o6S6C',NULL),(11,100055,'keria','keria@gmail.com',NULL,'m',NULL,NULL,NULL,NULL,'$2b$10$ewZhU83vzRmfBBB4x0yAju.2CcW0YXbA23iSYbiTFH4G4fEighNY2',NULL),(12,100056,'doran','doran@gmail.com',NULL,'m',NULL,NULL,NULL,NULL,'$2b$10$a67z9t5m9z7MEf91X6Vz4.DmK1hp9GugBQ99qZJHUAKTfq3KYWPki',NULL),(13,100057,'zeus','zeus@gmail.com',NULL,'m',NULL,NULL,NULL,NULL,'$2b$10$itHTBeKLcjj.rAh/QrqiJu2awmTqHuYKSfkj944Xf7wzjDNRHO5NO',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `wishlists_members_id` int NOT NULL,
  `wishlists_products_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_wishlists_members_idx` (`wishlists_members_id`),
  KEY `fk_wishlists_products` (`wishlists_products_id`),
  CONSTRAINT `fk_wishlists_products` FOREIGN KEY (`wishlists_products_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_wishlists_users` FOREIGN KEY (`wishlists_members_id`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (2,10001,1),(3,10001,12),(4,10001,12),(5,10003,25);
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-04  0:43:19

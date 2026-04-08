CREATE DATABASE  IF NOT EXISTS `marketplace` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `marketplace`;
-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: marketplace
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_756f53ab9466eb52a52619ee01` (`userId`),
  CONSTRAINT `FK_756f53ab9466eb52a52619ee019` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,3),(2,5),(3,6);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productId` int DEFAULT NULL,
  `cartId` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `priceAt` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_75db0de134fe0f9fe9e4591b7bf` (`productId`),
  KEY `FK_29e590514f9941296f3a2440d39` (`cartId`),
  CONSTRAINT `FK_29e590514f9941296f3a2440d39` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_75db0de134fe0f9fe9e4591b7bf` FOREIGN KEY (`productId`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `fecha` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_caabe91507b3379c7ba73637b84` (`userId`),
  CONSTRAINT `FK_caabe91507b3379c7ba73637b84` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,3,12.50,'2025-12-18 15:59:31.000000'),(2,3,9.99,'2025-12-18 16:07:55.000000'),(3,3,12.50,'2025-12-18 16:16:15.000000'),(4,6,124.48,'2025-12-18 17:33:12.000000');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int DEFAULT NULL,
  `productId` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_646bf9ece6f45dbe41c203e06e0` (`orderId`),
  KEY `FK_904370c093ceea4369659a3c810` (`productId`),
  CONSTRAINT `FK_646bf9ece6f45dbe41c203e06e0` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_904370c093ceea4369659a3c810` FOREIGN KEY (`productId`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,2,4,1,9.99),(2,3,1,1,12.50),(3,4,1,1,12.50),(4,4,5,2,55.99);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '0',
  `image` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (1,'Camiseta Blanca','Camiseta 100% algodón, talla M',12.50,44,'https://res.cloudinary.com/dl2jmv5ux/image/upload/v1766097336/f2ytkcragfrnrjmukhor.jpg','2025-12-17 06:01:02.906098'),(2,'Auriculares Bluetooth','Auriculares con cancelación de ruido',59.99,16,NULL,'2025-12-17 06:01:02.931616'),(3,'Mochila Urbana','Mochila resistente al agua',39.90,15,NULL,'2025-12-17 06:01:02.944721'),(4,'Test Product','Descripción de prueba',9.99,3,NULL,'2025-12-17 06:11:43.659050'),(5,'Saco','Hecho 100% de lana ',55.99,6,'https://res.cloudinary.com/dl2jmv5ux/image/upload/v1766078422/ezt4dolyrmxaaoj6kazb.jpg','2025-12-18 12:10:37.735208'),(6,'Camisa ','Tela fria',18.00,21,'https://res.cloudinary.com/dl2jmv5ux/image/upload/v1766078379/frriybq4v34dvijr3u7f.jpg','2025-12-18 12:20:09.064374'),(7,'Saco verde','',20000.00,25,'https://res.cloudinary.com/dl2jmv5ux/image/upload/v1766097369/o8nmlgdpetwhfhweepuq.jpg','2025-12-18 17:36:23.118942');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar` text COLLATE utf8mb4_unicode_ci,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `role` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','admin@example.com','$2a$10$FmertVaJ0vruwsn8rtVgneBHgF18fm/./L1Zq/NMH828.H40NFZRO',NULL,'2025-12-17 05:58:21.650039','admin'),(2,'user','user@example.com','$2a$10$oNpIoy6PqAFU.yaPEpyfY.rmgCxplT0I9W1CTKRWzv19pG5rhZ3Nu',NULL,'2025-12-17 05:58:22.139649','user'),(3,'Juan David ','juandavidmr77@gmail.com','$2a$10$1iGrRAHcsCUdQprDMTTfDOJxI2vVrnDfzrwzHKWNqqB0KzPqR26Ry','https://res.cloudinary.com/dl2jmv5ux/image/upload/v1766075790/mtu9kd7h6xrjhtbtbbew.jpg','2025-12-17 06:37:04.603451','admin'),(4,'Juan Gomez','juangomez@gmail.com','$2a$10$feyGo7mMh/1.EDP2JLOh1.oB82qN.V9Mi8xqMpzTrzBEUhCU19OqW',NULL,'2025-12-18 12:23:48.355396','user'),(5,'Juan Marin Ruiz','juandavidmr777@gmail.com','$2a$10$zSJLkayVC54RF0vKNfUiKeomL418Q9ruMz7bUieM22FUyGdlUvebO','https://res.cloudinary.com/dl2jmv5ux/image/upload/v1766096766/yu5atfjoj4pqxldbbtxg.jpg','2025-12-18 17:23:45.633285','user'),(6,'Diana ','admin@gmail.com','$2a$10$RjqAO6ySm6T3RL/KyigeB.xaaFWWo0ygkZnagLKiHYg.i.KnbuG7K','https://res.cloudinary.com/dl2jmv5ux/image/upload/v1766097227/ilgxuphnmpqtm95wh6yn.jpg','2025-12-18 17:32:41.331950','user');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'marketplace'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-18 17:42:55

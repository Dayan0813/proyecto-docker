  -- Volcado SQL para MySQL generado a partir de las entidades TypeORM
  -- Base de datos: `marketplace` (cámbiala si hace falta)

  CREATE DATABASE IF NOT EXISTS `marketplace` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  USE `marketplace`;

  -- El orden de creación respeta las dependencias FK

  DROP TABLE IF EXISTS `cart_item`;
  DROP TABLE IF EXISTS `cart`;
  DROP TABLE IF EXISTS `product`;
  DROP TABLE IF EXISTS `user`;

  CREATE TABLE `user` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `avatar` TEXT NULL,
    `role` VARCHAR(32) NOT NULL DEFAULT 'user',
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UQ_user_email` (`email`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE `product` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 0,
    `image` TEXT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE `cart` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `userId` INT NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `UQ_cart_userId` (`userId`),
    CONSTRAINT `FK_cart_user` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  CREATE TABLE `cart_item` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `productId` INT NOT NULL,
    `cartId` INT NOT NULL,
    `quantity` INT NOT NULL,
    `priceAt` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `IDX_cart_item_productId` (`productId`),
    KEY `IDX_cart_item_cartId` (`cartId`),
    CONSTRAINT `FK_cart_item_product` FOREIGN KEY (`productId`) REFERENCES `product` (`id`),
    CONSTRAINT `FK_cart_item_cart` FOREIGN KEY (`cartId`) REFERENCES `cart` (`id`) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

  -- Instrucciones de importación:
  -- 1) Desde la línea de comandos con el cliente mysql:
  --    mysql -u <usuario> -p < db_dump.sql
  --    (esto importará el volcado y creará la BD `marketplace`)
  -- 2) Alternativamente, entrar al cliente y usar SOURCE:
  --    mysql -u <usuario> -p
  --    mysql> SOURCE /ruta/completa/a/db_dump.sql;

  -- Nota: si tu proyecto TypeORM usa otros nombres de tablas o prefijo, adapta los nombres.
  -- ¿Quieres que incluya datos de ejemplo (usuarios, productos) en el volcado? --

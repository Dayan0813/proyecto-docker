import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Product } from "./entity/Product";
import { Cart } from "./entity/Cart";
import { CartItem } from "./entity/CartItem";
import * as dotenv from "dotenv";
import { Order } from "./entity/Order";
import { OrderItem } from "./entity/OrderItem";
dotenv.config();

const entities = [User, Product, Cart, CartItem, Order, OrderItem];

const useMySQL = process.env.DB_TYPE === "mysql";

export const AppDataSource = new DataSource(
  useMySQL
    ? {
        type: "mysql",
        host: process.env.DB_HOST || "sql-data",
        port: parseInt(process.env.DB_PORT || "3306", 10),
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "marketplace",
        synchronize: true,
        logging: false,
        entities,
        migrations: [],
        subscribers: [],
      }
    : {
        type: "sqlite",
        database: process.env.DB_PATH || "database.sqlite",
        synchronize: true,
        logging: false,
        entities,
        migrations: [],
        subscribers: [],
      }
);

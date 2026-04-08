import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity("order_item")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: "CASCADE" })
  order!: Order;

  @ManyToOne(() => Product, (product) => product.id)
  product!: Product;
}
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { OrderItem } from "./OrderItem";

@Entity("order")
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  total!: number;

  @CreateDateColumn({ name: "fecha" })
  fecha!: Date;

  @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
  user!: User;

  @Column()
  userId!: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  items!: OrderItem[];
}
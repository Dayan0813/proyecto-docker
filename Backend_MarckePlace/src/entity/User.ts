import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from "typeorm";
import { Cart } from "./Cart";

export type UserRole = "admin" | "user";

@Entity()
export class User {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "text", nullable: true })
  avatar?: string;

  @Column({ type: "varchar", length: 32, default: "user" })
  role!: UserRole;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToOne(() => Cart, (cart) => cart.user)
  cart?: Cart;
}

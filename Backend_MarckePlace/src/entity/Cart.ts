import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
} from "typeorm";
import { User } from "./User";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  // Definimos la columna física
  @Column({ name: "userId" })
  userId!: number;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn({ name: "userId" }) // Esto vincula el objeto 'user' con la columna 'userId'
  user!: User;

  @OneToMany(() => CartItem, (item) => item.cart)
  items!: CartItem[];
}
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from "typeorm";
import { Product } from "./Product";
import { Cart } from "./Cart";

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column("int")
  quantity!: number;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  priceAt!: number;

  // Forzamos el nombre de la columna a 'productId'
  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: "productId" }) 
  product!: Product;

  // Forzamos el nombre de la columna a 'cartId'
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "cartId" })
  cart!: Cart;
}
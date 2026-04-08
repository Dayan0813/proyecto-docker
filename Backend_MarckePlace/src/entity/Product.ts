import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("increment")
  id!: number;

  @Column()
  name!: string;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column("int", { default: 0 })
  quantity!: number;

  @Column({ type: "text", nullable: true })
  image?: string;

  @CreateDateColumn()
  createdAt!: Date;
}

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

const repo = () => AppDataSource.getRepository(Product);

export const getProducts = async (req: Request, res: Response) => {
  console.log("Entra");
  const products = await repo().find();
  console.log(products);
  res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const p = await repo().findOneBy({ id: Number(req.params.id) });
  if (!p) return res.status(404).json({ message: "Not found" });
  res.json(p);
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, quantity } = req.body;
  const image = req.file ? req.file.filename : undefined;
  const product = repo().create({
    name,
    description,
    price: Number(price),
    quantity: Number(quantity),
    image,
  });
  await repo().save(product);
  res.status(201).json(product);
};

// Usa esta para CREAR
export const createProductJson = async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, image } = req.body;

    const product = repo().create({
      name,
      description,
      price: Number(price),
      quantity: Number(quantity),
      image: image, // Aquí llega la URL de Cloudinary
    });

    await repo().save(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al crear producto" });
  }
};

// Modifica tu UPDATE para que también reciba la imagen por JSON
export const updateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const p = await repo().findOneBy({ id });

  if (!p) return res.status(404).json({ message: "Not found" });

  const { name, description, price, quantity, image } = req.body;

  // Actualizamos solo si el valor viene en el body
  p.name = name ?? p.name;
  p.description = description ?? p.description;
  p.price = price !== undefined ? Number(price) : p.price;
  p.quantity = quantity !== undefined ? Number(quantity) : p.quantity;

  // IMPORTANTE: Actualiza la URL de la imagen de Cloudinary si viene una nueva
  if (image) p.image = image;

  await repo().save(p);
  res.json(p);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const p = await repo().findOneBy({ id });
  if (!p) return res.status(404).json({ message: "Not found" });
  await repo().remove(p);
  res.json({ message: "Deleted" });
};

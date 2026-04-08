import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { Product } from "../entity/Product";
import { User } from "../entity/User";

const cartRepo = () => AppDataSource.getRepository(Cart);
const cartItemRepo = () => AppDataSource.getRepository(CartItem);
const productRepo = () => AppDataSource.getRepository(Product);

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const cart = await cartRepo().findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product"], // Cargamos el producto para ver imagen/precio en el front
    });

    if (!cart) return res.json({ items: [] });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const userId = (req as any).user.id;

    const cartRepo = AppDataSource.getRepository(Cart);
    const itemRepo = AppDataSource.getRepository(CartItem);
    const productRepo = AppDataSource.getRepository(Product);

    // 1. Buscar o crear el carrito
    let cart = await cartRepo.findOne({ where: { user: { id: userId } } });

    if (!cart) {
      const userRepo = AppDataSource.getRepository(User);
      const user = await userRepo.findOneBy({ id: userId });
      if (!user)
        return res.status(404).json({ message: "Usuario no encontrado" });

      cart = cartRepo.create({ user: user });
      await cartRepo.save(cart);
    }

    // 2. IMPORTANTE: Aquí 'cart' ya no es null.
    // Usamos una validación extra para que TS no se queje.
    if (!cart) throw new Error("Error al obtener el carrito");

    // 3. Buscar el producto
    const product = await productRepo.findOneBy({ id: productId });
    if (!product)
      return res.status(404).json({ message: "Producto no encontrado" });

    // 4. Buscar si ya existe el item
    let item = await itemRepo.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: product.id },
      },
    });

    if (item) {
      item.quantity += Number(quantity);
    } else {
      // Usamos el objeto directamente asegurándonos de que no son null
      item = itemRepo.create({
        cart: cart, // TS ya sabe que no es null por el check de arriba
        product: product,
        quantity: Number(quantity),
        priceAt: product.price,
      });
    }

    await itemRepo.save(item);
    res.json({ message: "Añadido al carrito", item });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
export const removeItem = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const item = await cartItemRepo().findOne({
      where: { id },
      relations: ["product"],
    });

    if (!item) return res.status(404).json({ message: "Item no encontrado" });

    // Devolver stock al producto
    const product = item.product;
    product.quantity += item.quantity;
    await productRepo().save(product);

    // Eliminar el item
    await cartItemRepo().remove(item);
    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el item" });
  }
};

export const checkout = async (req: Request, res: Response) => {
  const { items, total } = req.body;
  const userId = (req as any).user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Usuario no autenticado" });
  }

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // 1. INSERTAR EN 'order' (La Cabecera)
    // Usamos NOW() para la fecha y obtenemos el ID generado
    const orderResult = await queryRunner.manager.query(
      "INSERT INTO `order` (userId, total, fecha) VALUES (?, ?, NOW())",
      [userId, total]
    );

    const newOrderId = orderResult.insertId;

    // 2. BUCLE FOR: INSERTAR EN 'order_item' (Los Detalles)
    for (const item of items) {
      // Guardamos cada producto individual vinculado al ID de la orden
      await queryRunner.manager.query(
        "INSERT INTO `order_item` (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
        [newOrderId, item.productId, item.quantity, item.price]
      );

      // 3. ACTUALIZAR STOCK
      // Restamos la cantidad comprada directamente en la DB
      await queryRunner.manager.update(Product, item.productId, {
        quantity: () => `quantity - ${Number(item.quantity)}`,
      });
    }

    // 4. VACIAR CARRITO
    const cart = await queryRunner.manager.findOne(Cart, {
      where: { user: { id: userId } },
    });

    if (cart) {
      // Borramos los items del carrito ya que la compra se completó
      await queryRunner.manager.delete(CartItem, { cart: { id: cart.id } });
    }

    // Confirmamos todos los cambios en la base de datos
    await queryRunner.commitTransaction();

    res.json({
      success: true,
      message: "Compra guardada correctamente",
      orderId: newOrderId,
    });
  } catch (error: any) {
    // Si algo sale mal, se deshacen todos los cambios (rollback)
    await queryRunner.rollbackTransaction();
    console.error("Error en el checkout:", error.message);
    res.status(500).json({ message: "Error al procesar la compra" });
  } finally {
    // Liberamos la conexión
    await queryRunner.release();
  }
};

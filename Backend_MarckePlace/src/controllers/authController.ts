import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { hashPassword, comparePassword } from "../utils/hash";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/AuthRequest";
import { Product } from "../entity/Product";
import { Order } from "../entity/Order";

const userRepo = () => AppDataSource.getRepository(User);

export const getMeController = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const userId = Number(req.user.id);

    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.avatar || null, // 🔥 mapeo correcto
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el usuario",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  const repo = userRepo();
  const existing = await repo.findOneBy({ email });
  if (existing)
    return res.status(400).json({ message: "Email already in use" });

  const user = repo.create({
    name,
    email,
    password: await hashPassword(password),
    role: role || "user",
  });
  await repo.save(user);
  // create cart for user
  const cartRepo = AppDataSource.getRepository("Cart" as any);
  const cart = cartRepo.create({ user });
  await cartRepo.save(cart);

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

export const login = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const repo = userRepo();
  const user = await repo.findOneBy({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await comparePassword(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id; // viene del JWT
    const { name, email, image } = req.body;

    const repo = userRepo();
    const user = await repo.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Validaciones básicas
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }

    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email inválido" });
      }

      // Verificar si el email ya está en uso
      const emailExists = await repo.findOneBy({ email });
      if (emailExists && emailExists.id !== user.id) {
        return res.status(400).json({ message: "El email ya está en uso" });
      }
    }

    // Actualizar campos
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (image !== undefined) user.avatar = image;

    await repo.save(user);

    return res.json({
      message: "Perfil actualizado correctamente",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar perfil" });
  }
};

// OBTENER TODOS LOS USUARIOS
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await userRepo().find({
      select: ["id", "name", "email", "role", "avatar"],
      order: { id: "DESC" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// ELIMINAR USUARIO
export const deleteUserController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await userRepo().findOneBy({ id: Number(id) });

    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Seguridad: No permitir que el admin se borre a sí mismo
    if (user.id === (req as any).user.id) {
      return res
        .status(400)
        .json({ message: "No puedes eliminar tu propia cuenta" });
    }

    await userRepo().remove(user);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const productRepo = AppDataSource.getRepository(Product);
    const orderRepo = AppDataSource.getRepository(Order);

    const usersCount = await userRepo.count();
    const productsCount = await productRepo.count();

    // Usamos getRawOne para obtener la suma y el conteo directamente de SQL
    const stats = await orderRepo
      .createQueryBuilder("o")
      .select("COUNT(o.id)", "count")
      .addSelect("SUM(o.total)", "revenue")
      .getRawOne();

    res.json({
      usersCount,
      productsCount,
      // Convertimos a número porque MySQL devuelve strings en SUM/COUNT
      ordersCount: Number(stats.count) || 0,
      totalRevenue: Number(stats.revenue) || 0,
    });
  } catch (error: any) {
    console.error("Error en stats:", error);
    res
      .status(500)
      .json({ message: "Error al obtener estadísticas: " + error.message });
  }
};
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Usamos relaciones para traer el nombre del usuario que hizo la compra
    const orders = await AppDataSource.query(`
      SELECT o.id, o.total, o.fecha, u.name 
      FROM \`order\` o 
      LEFT JOIN user u ON o.userId = u.id 
      ORDER BY o.fecha DESC
    `);

    // Formateamos para que el frontend reciba "user: { name: '...' }"
    const formattedOrders = orders.map((o: any) => ({
      id: o.id,
      total: o.total,
      fecha: o.fecha,
      user: { name: o.name },
    }));

    res.json(formattedOrders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

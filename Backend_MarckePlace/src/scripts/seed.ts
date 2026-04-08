import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

async function main() {
  try {
    await AppDataSource.initialize();
    const repo = AppDataSource.getRepository(Product);
    const existing = await repo.count();
    if (existing > 0) {
      console.log(`Already have ${existing} products. Skipping seed.`);
    } else {
      const products = [
        {
          name: "Camiseta Blanca",
          description: "Camiseta 100% algodón, talla M",
          price: 12.5,
          quantity: 50,
        },
        {
          name: "Auriculares Bluetooth",
          description: "Auriculares con cancelación de ruido",
          price: 59.99,
          quantity: 20,
        },
        {
          name: "Mochila Urbana",
          description: "Mochila resistente al agua",
          price: 39.9,
          quantity: 15,
        },
      ];
      for (const p of products) {
        const prod = repo.create(p as Partial<Product>);
        await repo.save(prod);
        console.log("Created product", prod.id, prod.name);
      }
    }
  } catch (e) {
    console.error("Seed error", e);
    process.exit(1);
  } finally {
    try {
      await AppDataSource.destroy();
    } catch (e) {}
  }
}

main();

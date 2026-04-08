import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import { join } from "path";

dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/uploads", express.static(join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

const PORT = Number(process.env.PORT) || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source initialized");
    app.listen(PORT, "0.0.0.0", () => console.log(`Server listening on PORT ${PORT}`));
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

export default app;

import express from "express";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.route.js";
import "dotenv/config";

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});

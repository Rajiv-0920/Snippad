import express from "express";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.route.js";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
  connectDB();
});

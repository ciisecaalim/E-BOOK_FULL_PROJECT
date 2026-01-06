import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";

// Routes
import adminRoutes from "./router/adminRouter.js";
import categoryRoutes from "./router/categoryRouter.js";
import contactRoutes from "./router/contactRoutes.js";
import customerRoutes from "./router/customerRouter.js";
import orderRoutes from "./router/orderRoutes.js";
import productRoutes from "./router/productRouter.js";
import userRoutes from "./router/useRouter.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploads folder
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Serve static files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => res.send("Welcome to BookMart Backend API"));

// All images route
app.get("/api/allImg", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: "Cannot read uploads folder", error: err });

    const allImg = files.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    res.json({ allImg });
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

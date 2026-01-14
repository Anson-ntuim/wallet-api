import express from "express";
import dotenv from "dotenv";
import { sql, initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
dotenv.config();

const PORT = process.env.PORT || 5001;

const app = express();

app.use(rateLimiter);
app.use(express.json());
// connectDB("process.env.DATABASE_URL");

app.use("/api/transactions", transactionsRoute);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

console.log("Server is running on port ", process.env.PORT);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port : ", PORT);
  });
});

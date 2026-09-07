import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
const app = express();
connectDB();
const port = process.env.port || 3000;
import authRouter from "./src/routes/authRoutes.js";
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.listen(port, (req, res) => {
  console.log(`Server is running on port highly spiritual ${port}`);
});

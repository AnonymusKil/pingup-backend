import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import { initializeSocket } from "./src/helpers/socketHelper.js";
const app = express();
const server = http.createServer(app);
connectDB();
initializeSocket(server);
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
server.listen(port, (req, res) => {
  console.log(`Server is running on port highly spiritual ${port}`);
});

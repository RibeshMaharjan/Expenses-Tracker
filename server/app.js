import cors from "cors";
import 'dotenv/config';
import express from "express";
import cookieParser from 'cookie-parser';
import routes from "./routes/index.js";
import path from "path";

const app = express();

const __dirname = path.join(path.resolve(), "../");

// middleware
app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.use("/api", routes);

app.use(express.static(path.resolve(__dirname, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

export default app;


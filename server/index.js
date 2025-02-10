import cors from "cors";
import 'dotenv/config';
import express from "express";

import pool from "./config/db.js";
const app = express();

const PORT = process.env.PORT;

// middleware
app.use(cors);
app.use(express.json());

// routes


// Server Init
app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
})


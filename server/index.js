import cors from "cors";
import 'dotenv/config';
import express from "express";

import routes from "./routes/index.js";
const app = express();

const PORT = process.env.PORT;

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
// app.use('/', (req, res) => {
//   res.send("<h1>Running...</h1>")
// })

app.use("/api", routes);

app.use("*", (req, res) => {
  res.status(404).json({
    status: "Not found",
    message: "Route not found",
  });
});

// Server Init
app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
})


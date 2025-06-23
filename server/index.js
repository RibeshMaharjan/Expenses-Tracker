import app from "./app.js";

const PORT = process.env.PORT || 8000;

// Server Init
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
})


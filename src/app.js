const express = require("express");
const app = express();
const PUERTO = 8080;
const productsRouter = require("./routes/products.router.js");

app.use(express.json());

app.use("/api/products", productsRouter);

app.listen(PUERTO, () => {
  console.log(`Escuchando en http://localhost:${PUERTO}`);
});

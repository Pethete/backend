import express from "express";
const router = express.Router();
import CartManager from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();
import CartModel from "../dao/models/cart.model.js";

router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartManager.crearCarrito();
    res.json(nuevoCarrito);
  } catch (error) {
    console.error("Error creando un nuevo carrito.", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await CartModel.findById(cartId);

    if (!carrito) {
      console.log("No existe carrito con ese Id.");
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    return res.json(carrito.products);
  } catch (error) {
    console.error("Error obteniendo carrito.", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity || 1;

  try {
    const actualizarCarrito = await cartManager.agregarProductoAlCarrito(
      cartId,
      productId,
      quantity
    );
    res.json(actualizarCarrito.products);
  } catch (error) {
    console.error("Error agregando producto al carrito.", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

export default router;

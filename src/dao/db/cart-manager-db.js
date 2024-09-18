import CartModel from "../models/cart.model.js";

class CartManager {
  async crearCarrito() {
    try {
      const nuevoCarrito = new CartModel({ products: [] });
      await nuevoCarrito.save();
      return nuevoCarrito;
    } catch (error) {
      console.log("Error al crear carrito.");
    }
  }

  async getCarritoById(cartId) {
    try {
      const carrito = await CartModel.findById(cartId);
      if (!carrito) {
        console.log("No existe carrito con ese ID");
        return null;
      }

      return carrito;
    } catch (error) {
      console.log("Error al ver carrito.", error);
    }
  }

  async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
    try {
      const carrito = await this.getCarritoById(cartId);
      const existeProducto = carrito.products.find(
        (item) => item.product.toString() === productId
      );

      if (existeProducto) {
        existeProducto.quantity += quantity;
      } else {
        carrito.products.push({ product: productId, quantity });
      }

      carrito.markModified("products");

      await carrito.save();
      return carrito;
    } catch (error) {
      console.log("Error al momento de agregar el producto.", error);
    }
  }

  async actualizarProductoEnCarrito(cartId, productId, newQuantity) {
    try {
      const carrito = await this.getCarritoById(cartId);

      // Verificar si el producto existe en el carrito
      const producto = carrito.products.find(
        (item) => item.product.toString() === productId
      );

      if (!producto) {
        console.log("El producto no existe en el carrito.");
        return null;
      }

      producto.quantity = newQuantity;
      carrito.markModified("products");
      await carrito.save();

      return carrito;
    } catch (error) {
      console.log("Error al actualizar el producto en el carrito.", error);
    }
  }

  async eliminarProductoDelCarrito(cartId, productId) {
    try {
      const carrito = await this.getCarritoById(cartId);

      carrito.products = carrito.products.filter(
        (item) => item.product.toString() !== productId
      );

      carrito.markModified("products");
      await carrito.save();

      return carrito;
    } catch (error) {
      console.log("Error al eliminar el producto del carrito.", error);
    }
  }
}

export default CartManager;

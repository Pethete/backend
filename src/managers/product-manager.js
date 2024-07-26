const fs = require("fs").promises;

class ProductManager {
  static ultId = 0;

  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct({ name, description, price, stock, category, code, image }) {
    if (!name || !description || !price || !stock || !category || !image) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((item) => item.code === code)) {
      console.log("El codigo debe ser unico.");
      return;
    }

    const nuevoProducto = {
      id: ++ProductManager.ultId,
      name,
      description,
      price,
      stock,
      category,
      image,
    };

    this.products.push(nuevoProducto);

    await this.guardarArchivo(this.products);
  }

  async getProducts() {
    try {
      const arrayProducts = await this.leerArchivo();
      return arrayProducts;
    } catch (error) {
      console.log("Error al leer archivo", error);
    }
  }

  async getProductById(id) {
    try {
      const arrayProducts = await this.leerArchivo();
      const buscado = arrayProducts.find((item) => item.id === id);
      if (!buscado) {
        console.log("Producto no encontrado");
        return null;
      } else {
        console.log("Producto encontrado");
        return buscado;
      }
    } catch (error) {
      console.log("Error al buscar por id", error);
    }
  }

  async leerArchivo() {
    const respuesta = await fs.readFile(this.path, "utf-8");
    const arrayProducts = JSON.parse(respuesta);
    return arrayProducts;
  }

  async guardarArchivo(arrayProducts) {
    await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
  }
  async updateProduct(id, productoActualizado) {
    try {
      const arrayProducts = await this.leerArchivo();
      const index = arrayProducts.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProducts[index] = {
          ...arrayProducts[index],
          ...productoActualizado,
        };
        await this.guardarArchivo(arrayProducts);
        console.log("Producto actualizado");
      } else {
        console.log("No se enecontro el producto");
      }
    } catch (error) {
      console.log("Tenemos un error al actualizar productos");
    }
  }

  async deleteProduct(id) {
    try {
      const arrayProducts = await this.leerArchivo();
      const index = arrayProducts.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProducts, splice(index, 1);
        await this.guardarArchivo(arrayProducts);
        console.log("Producto eliminado");
      } else {
        console.log("No se enecontro el producto");
      }
    } catch (error) {
      console.log("Tenemos un error al eliminar productos");
    }
  }
}

module.exports = ProductManager;

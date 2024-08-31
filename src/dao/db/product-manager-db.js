import ProductModel from "../models/product.model.js";

class ProductManager {
  async addProduct({ name, description, price, stock, category, code, image }) {
    try {
      if (
        !name ||
        !description ||
        !price ||
        !image ||
        !code ||
        !stock ||
        !category
      ) {
        console.log("Todos los campos son obligatorios.");
        return;
      }

      const existeProducto = await ProductModel.findOne({ code: code });

      if (existeProducto) {
        console.log("Codigo repetido, debe de ser unico.");
        return;
      }

      const newProduct = new ProductModel({
        name,
        description,
        price,
        image,
        category,
        code,
        stock,
      });

      await newProduct.save();
    } catch (error) {
      console.log("Error al agregar producto.", error);
      throw error;
    }
  }

  async getProducts({ limit = 10, page = 1, sort, query } = {}) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const productos = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: productos,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      console.log("Error al obtener los productos.", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const producto = await ProductModel.findById(id);

      if (!producto) {
        console.log("Producto no encontrado");
        return null;
      }

      console.log("Producto encontrado.");
      return producto;
    } catch (error) {
      console.log("Error al encontrar producto por Id.");
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      const actualizado = await ProductModel.findByIdAndUpdate(
        id,
        productoActualizado
      );

      if (!actualizado) {
        console.log("No se encuentra el producto.");
        return null;
      }

      console.log("Actualizado correctamente.");
      return actualizado;
    } catch (error) {
      console.log("Error actualizando el producto.", error);
    }
  }

  async deleteProduct(id) {
    try {
      const borrado = await ProductModel.findByIdAndDelete(id);

      if (!borrado) {
        console.log("No se encuentra el producto a borrar.");
        return null;
      }

      console.log("Producto eliminado correctamente.");
    } catch (error) {
      console.log("Error al eliminar el producto.", error);
      throw error;
    }
  }
}

export default ProductManager;

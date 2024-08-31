import mongoose from "mongoose";

mongoose
  .connect(
    "mongodb+srv://pnocerar:00IdFnhXAEIFBwhG@cluster0.qwcfbqa.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Conexion exitosa"))
  .catch((error) => console.log("Error: ", error));

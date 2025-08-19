const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./Routes/UserRoutes");
const inventoryRouter = require("./Routes/InventoryRoutes");
const productRouter = require("./Routes/ProductRoutes");

const app = express();
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/inventory", inventoryRouter);
app.use("/products", productRouter);

mongoose.connect("mongodb+srv://admin:5ujIqBeOwJYjq1hM@cluster1.lmzaxue.mongodb.net/")
  .then(() => console.log("Connected to MongoDB"))
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => console.log(err));
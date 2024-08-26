import mongoose from "mongoose";

const db = mongoose.connection;

export const Customer = db.collection("shopifyCustomers");
export const Product = db.collection("shopifyProducts");

const orderSchema = new mongoose.Schema(
  {},
  { collection: "shopifyOrders", strict: false }
);

const customerSchema = new mongoose.Schema(
  {},
  { collection: "shopifyCustomers", strict: false }
);

const productSchema = new mongoose.Schema(
  {},
  { collection: "shopifyProducts", strict: false }
);

export const Orders = mongoose.model("Order", orderSchema, "shopifyOrders");

export const Customers = mongoose.model(
  "Customer",
  customerSchema,
  "shopifyCustomers"
);

export const Products = mongoose.model(
  "Product",
  productSchema,
  "shopifyProducts"
);

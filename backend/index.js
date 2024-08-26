import express from "express";
import connectDB from "./config/dbConnect.js";
import cors from "cors";
import {
  getCustomerGeoData,
  getNewCustomers,
  getRepeatCustomers,
  getSakesGrowth,
  getTotalSales,
} from "./controller/api.js";

const app = express();

const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const port = process.env.PORT;

connectDB();

app.get("/sales", getTotalSales);
app.get("/sales-growth", getSakesGrowth);
app.get("/new-customers", getNewCustomers);
app.get("/repeat-customers", getRepeatCustomers);
app.get("/customers-geo-data", getCustomerGeoData);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

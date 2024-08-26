import {
  customersGeoData,
  newCustomersData,
  repeatCustomersData,
  salesGrowthData,
  totalSalesData,
} from "../dbUtils/operations.js";
import { getFormattedDates } from "./utils.js";

export async function getTotalSales(req, res) {
  try {
    const { start, end, interval } = getFormattedDates(
      req.query,
      "start",
      "end"
    );

    const sales = await totalSalesData(start, end, interval);

    res.json(sales);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function getSakesGrowth(req, res) {
  try {
    const { start, end, interval } = getFormattedDates(
      req.query,
      "start",
      "end"
    );

    const sales = await salesGrowthData(start, end, interval);

    res.json(sales);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function getNewCustomers(req, res) {
  try {
    const { start, end, interval } = getFormattedDates(
      req.query,
      "start",
      "end"
    );

    const sales = await newCustomersData(start, end, interval);

    res.json(sales);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function getRepeatCustomers(req, res) {
  try {
    const { start, end, interval } = getFormattedDates(
      req.query,
      "start",
      "end"
    );

    const sales = await repeatCustomersData(start, end, interval);

    res.json(sales);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

export async function getCustomerGeoData(req, res) {
  try {
    const geoData = await customersGeoData();

    res.json(geoData);
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
}

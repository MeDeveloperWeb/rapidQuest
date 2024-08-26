import { Customers, Orders } from "../models/model.js";
import {
  groupByInterval,
  matchDateRange,
  projectFormattedDate,
  sortBy,
} from "./stages.js";
import { isValidInterval } from "./utils.js";

export async function totalSalesData(start, end, interval) {
  if (!isValidInterval(interval)) throw Error("Invalid Interval!");

  return Orders.aggregate([
    matchDateRange(start, end),

    projectFormattedDate("created_at", "created_date", { total_price: 1 }),

    groupByInterval(interval, "created_date", {
      totalSales: { $sum: { $toDouble: "$total_price" } },
    }),
    {
      $project: {
        _id: false,
        [interval]: `$_id.${interval}`,
        totalSales: "$totalSales",
      },
    },
    sortBy(interval),
  ]);
}

export async function salesGrowthData(start, end, interval) {
  if (!isValidInterval(interval)) throw Error("Invalid Interval!");

  return await Orders.aggregate([
    matchDateRange(start, end),
    projectFormattedDate("created_at", "created_date", { total_price: 1 }),
    groupByInterval(interval, "created_date", {
      totalSales: { $sum: { $toDouble: "$total_price" } },
    }),
    {
      $project: {
        _id: false,
        [interval]: `$_id.${interval}`,
        totalSales: "$totalSales",
      },
    },
    {
      $setWindowFields: {
        sortBy: { [interval]: 1 },
        output: {
          prevSales: {
            $shift: {
              output: "$totalSales",
              by: -1,
              default: 0,
            },
          },
        },
      },
    },
  ]);
}

export async function newCustomersData(start, end, interval) {
  if (!isValidInterval(interval)) throw Error("Invalid Interval!");

  return Customers.aggregate([
    matchDateRange(start, end),
    projectFormattedDate("created_at", "created_date"),
    groupByInterval(interval, "created_date", {
      count: {
        $sum: 1,
      },
    }),
    {
      $project: {
        _id: false,
        [interval]: `$_id.${interval}`,
        count: "$count",
      },
    },
    sortBy(interval),
  ]);
}

export async function repeatCustomersData(start, end, interval) {
  if (!isValidInterval(interval)) throw Error("Invalid Interval!");

  return Orders.aggregate([
    matchDateRange(start, end),
    projectFormattedDate("created_at", "created_date", {
      customerId: {
        $toString: "$customer.id",
      },
    }),
    {
      $group: {
        _id: {
          [interval]: { ["$" + interval]: "$created_date" },
          customerId: "$customerId",
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $match: {
        count: {
          $gt: 1,
        },
      },
    },
    {
      $project: {
        _id: false,
        [interval]: `$_id.${interval}`,
        count: "$count",
      },
    },
    sortBy(interval),
  ]);
}

export async function customersGeoData() {
  return Customers.aggregate([
    {
      $group: {
        _id: "$default_address.city",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: false,
        cityCount: {
          k: "$_id",
          v: "$count",
        },
      },
    },
    {
      $group: {
        _id: null,
        cityCounts: {
          $push: "$cityCount",
        },
      },
    },
    {
      $project: {
        _id: false,
        cityCounts: {
          $arrayToObject: "$cityCounts",
        },
      },
    },
  ]);
}

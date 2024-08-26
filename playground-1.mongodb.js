/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/

// Select the database to use.
use("RQ_Analytics");

const Order = db.getCollection("shopifyOrders");
const Customer = db.getCollection("shopifyCustomers");
const Product = db.getCollection("shopifyProducts");

// Insert a few documents into the sales collection.

async function explain(...args) {
    const before = new Date();
    const sales = await getNewCustomers(...args);
    const after = new Date();

    execution_mills = after - before;

    console.log(
        execution_mills,
        after.getMilliseconds(),
        before.getMilliseconds()
    );

    return sales;
}

const matchDateRange = (start, end) => ({
    $match: {
        created_at: {
            $gte: start,
            $lt: end,
        },
    },
});

const projectFormattedData = {
    $project: {
        total_price: 1,
        created_date: {
            $dateFromString: { dateString: "$created_at" },
        },
    },
};

const groupByInterval = (interval) => ({
    $group: {
        _id: {
            [interval]: { ["$" + interval]: "$created_date" },
        },
        totalSales: { $sum: { $toDouble: "$total_price" } },
    },
});

const sortByInterval = (interval) => ({
    $sort: { [`_id.${interval}`]: 1 },
});

async function getTotalSales(start, end, interval) {
    const total = await Order.aggregate([
        matchDateRange(start.toISOString(), end.toISOString()),
        projectFormattedData,
        groupByInterval(interval),
        sortByInterval(interval),
    ]);
    return total;
}

async function getSalesGrowth(start, end, interval) {
    const growth = await Order.aggregate([
        matchDateRange(start.toISOString(), end.toISOString()),
        projectFormattedData,
        groupByInterval(interval),
        {
            $setWindowFields: {
                sortBy: { [`_id.${interval}`]: 1 },
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
    return growth;
}

async function getNewCustomers(start, end, interval) {
    const customers = Customer.aggregate([
        matchDateRange(start.toISOString(), end.toISOString()),
        {
            $project: {
                created_date: {
                    $dateFromString: { dateString: "$created_at" },
                },
            },
        },
        {
            $group: {
                _id: {
                    [interval]: { ["$" + interval]: "$created_date" },
                },
                count: {
                    $sum: 1,
                },
            },
        },
        sortByInterval(interval),
    ]);

    return customers;
}

async function getRepeatCustomers(start, end, interval) {
    const repeats = Order.aggregate([
        matchDateRange(start.toISOString(), end.toISOString()),
        {
            $project: {
                created_date: {
                    $dateFromString: { dateString: "$created_at" },
                },
                customerId: "$customer.id",
            },
        },
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
        sortByInterval(interval),
    ]);
    return repeats;
}

getRepeatCustomers(
    new Date("2023-01-01:00:00"),
    new Date("2024-01-01:00:00"),
    "month"
);

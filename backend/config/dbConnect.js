import { connect } from "mongoose";

export default async function connectDB() {
  await connect(process.env.DB_URI, { dbName: "RQ_Analytics" })
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(err));
}

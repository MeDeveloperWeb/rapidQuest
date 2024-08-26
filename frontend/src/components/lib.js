import dayjs from "dayjs";

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const intervals = [
  {
    label: "Day",
    value: "dayOfMonth",
  },
  {
    label: "Month",
    value: "month",
  },
  {
    label: "Year",
    value: "year",
  },
];

export const years = [2020, 2021, 2022, 2023, 2024];

export function intervalFormatter(val, context, format) {
  if (context.location === "tick" && format.interval === "month")
    return months[val - 1];

  if (context.location === "tick") return `${val}`;

  if (format.interval === "year") return `${val}`;

  const date = dayjs.utc(format.start);

  if (format.interval === "month") return `${months[val - 1]} ${date.year()}`;

  if (format.interval === "dayOfMonth")
    return `${val} ${months[date.month()]} ${date.year()}`;
}

export function isValidInterval(interval) {
  return (
    interval === "dayOfMonth" || interval === "month" || interval === "year"
  );
}

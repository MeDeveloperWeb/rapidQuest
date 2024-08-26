import { useState } from "react";
import { intervals, years } from "../lib";
import { Input, Select } from "./Input";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import PropTypes from "prop-types";

dayjs.extend(utc);

export default function Filter({ onChange, defaultFormat }) {
  const defaultStartDate = dayjs.utc(defaultFormat.start);
  const defaultEndDate = dayjs.utc(defaultFormat.end);

  const [interval, setInterval] = useState(defaultFormat.interval);

  const [month, setMonth] = useState(
    /** {year}-{01/02/.../11/12} */
    `${defaultStartDate.year()}-${
      defaultStartDate.month() < 9
        ? "0" + (defaultStartDate.month() + 1)
        : defaultStartDate.month() + 1
    }`
  );

  const [startYear, setStartYear] = useState(`${defaultStartDate.year()}`);
  const [endYear, setEndYear] = useState(`${defaultEndDate.year()}`);

  const [hasChanged, setHasChanged] = useState(false);

  return (
    <div>
      <form
        className="flex flex-wrap gap-4 justify-center"
        onChange={() => setHasChanged(true)}
        onSubmit={(e) => {
          e.preventDefault();
          setHasChanged(false);

          const start =
            interval === "dayOfMonth"
              ? dayjs.utc(month).startOf("month").toISOString()
              : dayjs.utc(`${startYear}`).startOf("year").toISOString();

          const end =
            interval === "dayOfMonth"
              ? dayjs.utc(month).endOf("month").toISOString()
              : interval === "month"
              ? dayjs.utc(`${startYear}`).endOf("year").toISOString()
              : dayjs.utc(`${endYear}`).endOf("year").toISOString();

          onChange({
            start,
            end,
            interval,
          });
        }}
      >
        <Select
          name="interval"
          id="interval"
          label="Interval"
          value={interval}
          onChange={({ target }) => setInterval(target.value)}
        >
          {intervals.map((interval, i) => (
            <option key={i} value={interval.value}>
              {interval.label}
            </option>
          ))}
        </Select>

        {interval === "dayOfMonth" && (
          <Input
            type="month"
            label={"Month"}
            id="month"
            name="month"
            value={month}
            onChange={({ target }) => setMonth(target.value)}
            min={"2022-01"}
            max={"2023-12"}
          />
        )}
        {interval === "month" && (
          <Select
            label={"Year"}
            id="year"
            name="year"
            value={startYear}
            onChange={({ target }) => setStartYear(target.value)}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        )}
        {interval === "year" && (
          <>
            <Select
              label={"Start Year"}
              id="start-year"
              name="start-year"
              value={startYear}
              onChange={({ target }) => setStartYear(target.value)}
            >
              {years.map(
                (year, i) =>
                  i !== years.length - 1 && (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
              )}
            </Select>
            <Select
              label={"End Year"}
              id="end-year"
              name="end-year"
              value={endYear}
              onChange={({ target }) => setEndYear(target.value)}
            >
              {years.map(
                (year) =>
                  year > startYear && (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
              )}
            </Select>
          </>
        )}
        <input
          type="submit"
          value={"Apply"}
          className={`bg-blue-200 text-slate-700 font-medium cursor-pointer px-4 py-2 rounded-3xl ${
            hasChanged ? "visible" : "invisible"
          }`}
        />
      </form>
    </div>
  );
}

Filter.propTypes = {
  onChange: PropTypes.func,
  defaultFormat: PropTypes.shape({
    interval: PropTypes.string,
    start: PropTypes.string,
    end: PropTypes.string,
  }),
};

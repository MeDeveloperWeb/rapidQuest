import { BarChart, LineChart } from "@mui/x-charts";
import { useEffect, useState } from "react";
import { apiGET } from "../../api/api";
import { intervalFormatter } from "../lib";
import Filter from "../utils/Filter";
import { capitalize } from "@mui/material";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function GrowthChart() {
  const [data, setData] = useState(null);

  const [Chart, setChart] = useState({
    El: LineChart,
    name: "lineChart",
  });

  const [format, setFormat] = useState({
    end: "2022-01-31T23:59:59.999Z",
    start: "2022-01-01T00:00:00.000Z",
    interval: "dayOfMonth",
  });

  useEffect(() => {
    async function fetchData() {
      const res = await apiGET("sales/", format);

      if (res.error) setData([]);
      else setData(res.data);
    }
    fetchData();
  }, [format]);

  return (
    <section className="shadow-md rounded-md py-4">
      <header className="flex justify-between flex-wrap gap-4 px-4">
        <h1 className="text-lg font-bold">Sales Growth Over Time</h1>
        <div className="flex gap-8 flex-wrap">
          <div className="flex gap-4 justify-center flex-1">
            <button
              className={`text-sm cursor-pointer px-4 py-2 rounded-3xl text-slate-700 ${
                Chart.name === "lineChart" ? "bg-blue-200" : "bg-gray-200"
              }`}
              onClick={() =>
                setChart({
                  El: LineChart,
                  name: "lineChart",
                })
              }
            >
              Line Chart
            </button>
            <button
              className={`text-sm cursor-pointer px-4 py-2 rounded-3xl text-slate-700 ${
                Chart.name === "barChart" ? "bg-blue-200" : "bg-gray-200"
              }`}
              onClick={() =>
                setChart({
                  El: BarChart,
                  name: "barChart",
                })
              }
            >
              Bar Chart
            </button>
          </div>
          <Filter onChange={setFormat} defaultFormat={format} />
        </div>
      </header>
      {!data ? (
        <p className="h-[300px] flex justify-center items-center text-sm italic text-slate-600">
          Loading... (Server is hosted for free, so please be patient)
        </p>
      ) : !data.length ? (
        <p className="h-[300px] flex justify-center items-center text-sm italic text-slate-600">
          No Sales in selected time span!
        </p>
      ) : (
        <Chart.El
          dataset={data}
          xAxis={[
            {
              scaleType: Chart.name === "lineChart" ? "point" : "band",
              dataKey: format.interval,
              label:
                format.interval === "dayOfMonth"
                  ? "Day of Month"
                  : capitalize(format.interval),
              valueFormatter: (val, context) =>
                intervalFormatter(val, context, format),
            },
          ]}
          series={[
            {
              data: data.map(({ totalSales }, i) => {
                if (i === 0) return 0;

                const prevSales = data[i - 1].totalSales;

                return (
                  Math.round(
                    (((totalSales - prevSales) * 100) / prevSales) * 100
                  ) / 100
                );
              }),
              label: "Sales Growth (in percent)",
              valueFormatter: (val) => val + "%",
            },
          ]}
          height={300}
          sx={{
            paddingTop: "10px",
          }}
        />
      )}
    </section>
  );
}

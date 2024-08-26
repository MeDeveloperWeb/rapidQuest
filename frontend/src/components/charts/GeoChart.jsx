import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js";
import {
  ChoroplethController,
  GeoFeature,
  ColorScale,
  ProjectionScale,
} from "chartjs-chart-geo";

import { topojson } from "chartjs-chart-geo";
import { apiGET } from "../../api/api";
import us from "us-atlas/counties-10m.json";

Chart.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale);

export default function GeoChart() {
  const [data, setData] = useState(null);

  const canvasRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      const res = await apiGET("customers-geo-data/");
      if (res.error) setData([]);
      else setData(res.data);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!data || !data.length) return;

    if (!canvasRef?.current) return;

    const nation = topojson.feature(us, us.objects.nation).features[0];
    const counties = topojson.feature(us, us.objects.counties).features;

    const dataSet = [];

    counties.forEach((d) => {
      if (data[0].cityCounts[d.properties.name])
        dataSet.push({
          feature: d,
          value: data[0].cityCounts[d.properties.name],
        });
    });

    const chart = new Chart(canvasRef.current.getContext("2d"), {
      type: "choropleth",
      data: {
        labels: dataSet.map((d) => d.feature.properties.name),
        datasets: [
          {
            label: "Counties",
            outline: nation,
            showOutline: true,
            data: dataSet,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          projection: {
            axis: "x",
            projection: "albersUsa",
          },
          color: {
            axis: "x",
            quantize: 5,
            legend: {
              position: "bottom-right",
              align: "bottom",
            },
          },
        },
      },
    });
    return () => chart.destroy();
  }, [data]);

  return (
    <section className="shadow-md rounded-md py-4 xl:col-span-2">
      <header className="flex justify-between flex-wrap gap-4 px-4">
        <h1 className="text-lg font-bold">Customers Geographical Data</h1>
      </header>
      {!data ? (
        <p className="h-[300px] flex justify-center items-center text-sm italic text-slate-600">
          Loading...
        </p>
      ) : !data.length ? (
        <p className="h-[300px] flex justify-center items-center text-sm italic text-slate-600">
          No Data Found!
        </p>
      ) : (
        <canvas ref={canvasRef}></canvas>
      )}
    </section>
  );
}

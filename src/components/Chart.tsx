// import Plot from "react-plotly.js";
import clsx from "clsx";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });
import { useLocale, useTranslations } from "next-intl";

import { fetchData } from "@/pages/api/chart";

type ChartProps = {
  id: string;
  className?: string;
  height?: number;
  width?: number;
  type?: "graphs" | "maps";
};

const Chart = ({
  id,
  className,
  type = "graphs",
  height = 450,
  width,
}: ChartProps) => {
  const [chartData, setChartData] = useState({
    data: [],
    layout: {},
  });
  const locale = useLocale();
  const t = useTranslations("components");

  useEffect(() => {
    if (!id) return;

    const fetchGraphData = async () => {
      if (id.length > 0) {
        const response = await fetchData(
          (locale === "fr" ? "fr/" : "") + type,
          id,
        );
        setChartData(response);
      }
    };
    fetchGraphData();
  }, [id, type, locale]);

  if (!chartData)
    return (
      <p className="flex items-center justify-center text-md text-center bg-gray-50 min-h-[300px]">
        {t("chart.loading")}
      </p>
    );

  return (
    <Plot
      divId={id}
      data={chartData.data}
      layout={{ ...chartData.layout, ...(width ? { width } : null), height }}
      config={{ responsive: true }}
      className={clsx("!block min-h-[300px]", className)}
    />
  );
};

export default Chart;

// import Plot from "react-plotly.js";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { Data } from "plotly.js-dist-min";
import React from "react";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const DashboardChart = ({
  data,
  layout,
  id,
  className,
  height = 450,
  width = 700,
}: {
  data: Data[];
  layout: object;
  id: string;
  className?: string;
  height?: number;
  width?: number;
}) => {
  if (!id || !data || !layout) {
    return <></>;
  }

  return (
    <Plot
      divId={id}
      data={data}
      layout={{ ...layout, width, height }}
      config={{ responsive: true }}
      className={clsx("!block", className)}
    />
  );
};

export default DashboardChart;

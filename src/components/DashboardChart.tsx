// import Plot from "react-plotly.js";
import dynamic from "next/dynamic";
import { Data } from "plotly.js-dist-min";
import React from "react";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const DashboardChart = ({
  data,
  layout,
  id,
  className,
}: {
  data: Data[];
  layout: object;
  id: string;
  className?: string;
}) => {
  if (!id || !data || !layout) {
    return <></>;
  }

  return <Plot divId={id} data={data} layout={layout} className={className} />;
};

export default DashboardChart;

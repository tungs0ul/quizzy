import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { COLORS } from "../../utils";
import { Result } from "../../App";

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  _,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (!percent) {
    return <></>;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

type Props = {
  data: Result[];
  resize?: boolean;
};

export default function PieGraph({ data, resize }: Props) {
  const [width, setWidth] = useState(
    resize
      ? Math.min(window.innerWidth / 2, window.innerHeight) * 0.75
      : Math.min(window.innerWidth, window.innerHeight) * 0.75
  );

  useEffect(() => {
    const handleResize = () => {
      let size = Math.min(window.innerWidth, window.innerHeight) * 0.75;
      if (resize) {
        size = size * 0.5;
      }
      setWidth(size);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  return (
    <div className="flex justify-center cursor-pointer">
      <PieChart width={width} height={width}>
        <Legend layout="horizontal" verticalAlign="top" align="center" />
        <Tooltip />
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={width / 2 - 50}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}

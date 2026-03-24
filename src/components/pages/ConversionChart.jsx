import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Won", value: 30 },
  { name: "Lost", value: 10 },
  { name: "In Progress", value: 20 },
];

const COLORS = ["#2ecc71", "#e74c3c", "#3498db"];

export default function ConversionChart() {
  return (
    <div>
      <h3>Deal Conversion</h3>

      <PieChart width={400} height={300}>
        <Pie
          data={data}
          dataKey="value"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </div>
  );
}
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const data = [
  { month: "Jan", deals: 10 },
  { month: "Feb", deals: 14 },
  { month: "Mar", deals: 8 },
  { month: "Apr", deals: 20 },
  { month: "May", deals: 18 },
];

export default function AnalyticsDashboard() {
  return (
    <div className="dashboard">
      <h2>Sales Analytics</h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="deals" fill="#2c4da7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
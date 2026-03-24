import React from "react";
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
ResponsiveContainer
} from "recharts";

const data = [
{month:"Jan",sales:4000},
{month:"Feb",sales:3000},
{month:"Mar",sales:5000},
{month:"Apr",sales:4500},
{month:"May",sales:7000}
];

function SalesChart(){

return(

<div style={{height:250}}>

<ResponsiveContainer>

<LineChart data={data}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="sales"
stroke="#6366f1"
/>

</LineChart>

</ResponsiveContainer>

</div>

);

}

export default SalesChart;
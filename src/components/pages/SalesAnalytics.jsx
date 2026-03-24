import {
BarChart,Bar,
LineChart,Line,
XAxis,YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
Legend
} from "recharts"

export default function SalesAnalytics({deals}){

const stageData=[
{stage:"Leads",count:deals.filter(d=>d.stage==="Leads").length},
{stage:"Qualified",count:deals.filter(d=>d.stage==="Qualified").length},
{stage:"Proposal",count:deals.filter(d=>d.stage==="Proposal").length},
{stage:"Closed",count:deals.filter(d=>d.stage==="Closed").length}
]

const revenueTrend=deals.map((d,i)=>({
name:d.name,
revenue:Number(d.value)
}))

return(

<div className="analytics">

<h2>Sales Analytics</h2>

<ResponsiveContainer width="100%" height={300}>

<BarChart data={stageData}>

<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="stage"/>
<YAxis/>
<Tooltip/>
<Legend/>

<Bar dataKey="count" fill="#6366F1"/>

</BarChart>

</ResponsiveContainer>

<h2>Revenue Trend</h2>

<ResponsiveContainer width="100%" height={300}>

<LineChart data={revenueTrend}>

<CartesianGrid strokeDasharray="3 3"/>
<XAxis dataKey="name"/>
<YAxis/>
<Tooltip/>

<Line
type="monotone"
dataKey="revenue"
stroke="#10B981"
strokeWidth={3}
/>

</LineChart>

</ResponsiveContainer>

</div>

)

}
import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import "./StripeCRM.css";

const initialDeals = [
  { id:1, name:"Website Project", customer:"Tech Corp", value:2000, stage:"Negotiation", tag:"Hot" },
  { id:2, name:"Mobile App", customer:"FinTech Ltd", value:5000, stage:"Proposal", tag:"Warm" },
  { id:3, name:"CRM SaaS", customer:"Retail Hub", value:9000, stage:"Closed", tag:"Hot" }
];

const predictionData = [
  {month:"Jan",sales:12000},
  {month:"Feb",sales:15000},
  {month:"Mar",sales:18000},
  {month:"Apr",sales:21000},
  {month:"May",sales:25000},
  {month:"Jun",sales:28000}
];

export default function StripeCRM(){

const [deals,setDeals]=useState(initialDeals)
const [search,setSearch]=useState("")
const [filter,setFilter]=useState("All")

const [activity,setActivity]=useState([
"John closed deal with Tech Corp",
"Sara created new deal",
"David scheduled meeting"
])

const [email,setEmail]=useState({
to:"",
subject:"",
message:""
})

/* Global Search */

const filteredDeals=useMemo(()=>{

let result=deals

if(filter!=="All")
result=result.filter(d=>d.tag===filter)

if(search)
result=result.filter(d=>
d.name.toLowerCase().includes(search.toLowerCase())
)

return result

},[search,filter,deals])

/* Email Send */

function sendEmail(){

if(!email.to || !email.subject) return

setActivity([
`Email sent to ${email.to}`,
...activity
])

setEmail({to:"",subject:"",message:""})

}

/* Analytics */

const totalRevenue=useMemo(()=>{
return deals.reduce((sum,d)=>sum+d.value,0)
},[deals])

return(

<div className="crm">

<h1>Stripe-Level CRM Dashboard</h1>

{/* KPI */}

<div className="kpis">

<div className="kpi">
<h3>Total Revenue</h3>
<p>${totalRevenue}</p>
</div>

<div className="kpi">
<h3>Total Deals</h3>
<p>{deals.length}</p>
</div>

<div className="kpi">
<h3>Conversion Rate</h3>
<p>63%</p>
</div>

</div>

{/* Global Search */}

<div className="searchbar">

<input
placeholder="Global Search..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

<select
value={filter}
onChange={(e)=>setFilter(e.target.value)}
>

<option>All</option>
<option>Hot</option>
<option>Warm</option>

</select>

</div>

{/* Deals Table */}

<table className="deal-table">

<thead>
<tr>
<th>Deal</th>
<th>Customer</th>
<th>Value</th>
<th>Stage</th>
<th>Tag</th>
</tr>
</thead>

<tbody>

{filteredDeals.map(d=>(

<tr key={d.id}>

<td>{d.name}</td>
<td>{d.customer}</td>
<td>${d.value}</td>
<td>{d.stage}</td>
<td className={`tag ${d.tag.toLowerCase()}`}>
{d.tag}
</td>

</tr>

))}

</tbody>

</table>

{/* AI Sales Prediction */}

<div className="chart">

<h2>AI Sales Prediction</h2>

<ResponsiveContainer width="100%" height={250}>

<LineChart data={predictionData}>

<CartesianGrid strokeDasharray="3 3"/>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line type="monotone" dataKey="sales" stroke="#635bff" strokeWidth={3}/>

</LineChart>

</ResponsiveContainer>

</div>

{/* Live Activity Feed */}

<div className="activity">

<h2>Live Sales Activity</h2>

{activity.map((a,i)=>(
<p key={i}>{a}</p>
))}

</div>

{/* Email Integration */}

<div className="email">

<h2>Email CRM</h2>

<input
placeholder="To"
value={email.to}
onChange={(e)=>setEmail({...email,to:e.target.value})}
/>

<input
placeholder="Subject"
value={email.subject}
onChange={(e)=>setEmail({...email,subject:e.target.value})}
/>

<textarea
placeholder="Message"
value={email.message}
onChange={(e)=>setEmail({...email,message:e.target.value})}
/>

<button onClick={sendEmail}>Send Email</button>

</div>

</div>

)

}
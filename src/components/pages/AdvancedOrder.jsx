import React, { useState, useEffect } from "react";
import "./AdvancedOrder.css";

export default function AdvancedOrder() {

const [products,setProducts]=useState([
{id:1,name:"Laptop",price:50000},
{id:2,name:"Mobile",price:20000},
{id:3,name:"Headphones",price:3000},
{id:4,name:"Keyboard",price:1500}
]);

const [orders,setOrders]=useState(()=>{
const saved=localStorage.getItem("orders")
return saved?JSON.parse(saved):[]
});

const [customer,setCustomer]=useState("");
const [product,setProduct]=useState("");
const [qty,setQty]=useState(1);
const [payment,setPayment]=useState("UPI");

useEffect(()=>{
localStorage.setItem("orders",JSON.stringify(orders))
},[orders]);

const addOrder=()=>{

if(!customer || !product){
alert("Enter customer and product")
return
}

const selected=products.find(p=>p.name===product)

const total=selected.price * qty

const newOrder={
id:Date.now(),
customer,
product,
price:selected.price,
qty,
total,
payment,
status:"Paid",
date:new Date().toLocaleDateString()
}

setOrders([...orders,newOrder])

setCustomer("")
setProduct("")
setQty(1)

}

const deleteOrder=(id)=>{
setOrders(orders.filter(o=>o.id!==id))
}

/* ANALYTICS */

const totalOrders=orders.length
const totalRevenue=orders.reduce((sum,o)=>sum+o.total,0)

return(

<div className="order-container">

<h1>CRM Order & Billing System</h1>

{/* ANALYTICS */}

<div className="order-stats">

<div className="stat">
Total Orders
<h2>{totalOrders}</h2>
</div>

<div className="stat">
Revenue
<h2>₹ {totalRevenue}</h2>
</div>

</div>

{/* ORDER FORM */}

<div className="order-form">

<input
placeholder="Customer Name"
value={customer}
onChange={(e)=>setCustomer(e.target.value)}
/>

<select
value={product}
onChange={(e)=>setProduct(e.target.value)}
>

<option value="">Select Product</option>

{products.map(p=>(
<option key={p.id}>{p.name}</option>
))}

</select>

<input
type="number"
value={qty}
onChange={(e)=>setQty(e.target.value)}
/>

<select
value={payment}
onChange={(e)=>setPayment(e.target.value)}
>

<option>UPI</option>
<option>Credit Card</option>
<option>Debit Card</option>
<option>Cash</option>

</select>

<button onClick={addOrder}>
Create Order
</button>

</div>

{/* ORDER TABLE */}

<table className="order-table">

<thead>
<tr>
<th>Customer</th>
<th>Product</th>
<th>Price</th>
<th>Qty</th>
<th>Total</th>
<th>Payment</th>
<th>Date</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{orders.map(o=>(

<tr key={o.id}>

<td>{o.customer}</td>
<td>{o.product}</td>
<td>₹ {o.price}</td>
<td>{o.qty}</td>
<td>₹ {o.total}</td>
<td>{o.payment}</td>
<td>{o.date}</td>

<td>
<button onClick={()=>deleteOrder(o.id)}>
Delete
</button>
</td>

</tr>

))}

</tbody>

</table>

</div>

)

}
export default function InvoiceGenerator({deal}){

if(!deal) return null

function printInvoice(){
window.print()
}

return(

<div className="invoice">

<h2>Invoice</h2>

<p>Customer: {deal.customer}</p>
<p>Deal: {deal.name}</p>
<p>Value: ₹{deal.value}</p>
<p>Status: {deal.status}</p>

<button onClick={printInvoice}>
Print Invoice
</button>

</div>

)

}
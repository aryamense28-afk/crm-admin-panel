import React,{useState} from "react"

function EventSidebar({events,deleteEvent}){

const [search,setSearch] = useState("")

const filtered = Array.isArray(events)
? events.filter(e =>
e.title?.toLowerCase().includes(search.toLowerCase())
)
:[]

return(

<div className="sidebar">

<h3>Events</h3>

<input
placeholder="Search events"
onChange={e=>setSearch(e.target.value)}
/>

<ul>

{filtered.map(e=>(

<li key={e.id}>

<b>{e.title}</b>

<p>Client: {e.extendedProps?.client}</p>

<p>Member: {e.extendedProps?.member}</p>

<button
onClick={()=>deleteEvent(e.id)}
>
Delete
</button>

</li>

))}

</ul>

</div>

)

}

export default EventSidebar
import React,{useState,useEffect} from "react"
import { v4 as uuidv4 } from "uuid"

function EventModal({event,onSave,onClose}){

const [title,setTitle] = useState("")
const [client,setClient] = useState("")
const [member,setMember] = useState("")
const [priority,setPriority] = useState("normal")

useEffect(()=>{

if(event?.title){
setTitle(event.title)
setClient(event.extendedProps?.client || "")
setMember(event.extendedProps?.member || "")
}

},[event])

const submit=()=>{

const colorMap={
high:"#ef4444",
normal:"#22c55e",
low:"#38bdf8"
}

onSave({

id:event?.id || uuidv4(),

title,

start:event.start,

color:colorMap[priority],

extendedProps:{
client,
member,
priority
}

})

}

return(

<div className="modal-overlay">

<div className="modal">

<h2>Meeting Details</h2>

<input
placeholder="Meeting Title"
value={title}
onChange={e=>setTitle(e.target.value)}
/>

<input
placeholder="Client Name"
value={client}
onChange={e=>setClient(e.target.value)}
/>

<input
placeholder="Team Member"
value={member}
onChange={e=>setMember(e.target.value)}
/>

<select
value={priority}
onChange={e=>setPriority(e.target.value)}
>

<option value="normal">Normal</option>
<option value="high">High Priority</option>
<option value="low">Low Priority</option>

</select>

<button onClick={submit}>Save</button>
<button onClick={onClose}>Cancel</button>

</div>

</div>

)

}

export default EventModal
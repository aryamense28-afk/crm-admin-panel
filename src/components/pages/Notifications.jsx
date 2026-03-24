import React,{useState} from "react";
import "./notify.css";

function Notification(){

const [msg,setMsg]=useState("");

const showNotification=(text)=>{

setMsg(text);

setTimeout(()=>{
setMsg("");
},3000);

};

return(

<div>

<button onClick={()=>showNotification("New Lead Assigned!")}>
Test Notification
</button>

{msg && <div className="toast">{msg}</div>}

</div>

)

}

export default Notification
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import {useState} from "react"

export default function CalendarScheduler(){

const [date,setDate]=useState(new Date())

return(

<div className="calendar">

<h2>Meeting Scheduler</h2>

<Calendar
value={date}
onChange={setDate}
/>

<p>Selected: {date.toDateString()}</p>

</div>

)

}
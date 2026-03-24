import React, { useState } from "react";
import Calendar from "react-calendar";

export default function MeetingCalendar() {

  const [date, setDate] = useState(new Date());

  return (
    <div>

      <h2>Meeting Scheduler</h2>

      <Calendar
        onChange={setDate}
        value={date}
      />

      <p>Selected Date: {date.toDateString()}</p>

    </div>
  );
}
import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay
} from "date-fns";

import "./Calendar.css";

export default function Calendar() {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month");

  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const addEvent = () => {

    if (!title) return;

    const newEvent = {
      date: selectedDate,
      title,
      time
    };

    setEvents([...events, newEvent]);
    setTitle("");
    setTime("");
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <button onClick={prevMonth}>‹</button>
      <h2>{format(currentDate, "MMMM yyyy")}</h2>
      <button onClick={nextMonth}>›</button>

      <div className="view-switch">
        <button onClick={() => setView("month")}>Month</button>
        <button onClick={() => setView("week")}>Week</button>
      </div>
    </div>
  );

  const renderDays = () => {

    const days = [];
    const startDate = startOfWeek(currentDate);

    for (let i = 0; i < 7; i++) {

      days.push(
        <div className="day-name" key={i}>
          {format(addDays(startDate, i), "EEE")}
        </div>
      );
    }

    return <div className="days-row">{days}</div>;
  };

  const renderCells = () => {

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);

    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {

      for (let i = 0; i < 7; i++) {

        const cloneDay = day;

        const dayEvents = events.filter(e =>
          isSameDay(e.date, cloneDay)
        );

        days.push(

          <div
            className={`cell ${
              !isSameMonth(day, monthStart) ? "disabled" : ""
            } ${
              isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={() => setSelectedDate(cloneDay)}
          >

            <span className="number">{format(day, "d")}</span>

            <div className="events">
              {dayEvents.map((e, i) => (
                <div key={i} className="event">
                  {e.title}
                </div>
              ))}
            </div>

          </div>
        );

        day = addDays(day, 1);
      }

      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );

      days = [];
    }

    return <div className="body">{rows}</div>;
  };

  return (

    <div className="calendar-page">

      {/* Stats Cards */}
      <div className="cards">

        <div className="card">
          <h4>Total Events</h4>
          <p>{events.length}</p>
        </div>

        <div className="card">
          <h4>Today</h4>
          <p>
            {events.filter(e => isSameDay(e.date, new Date())).length}
          </p>
        </div>

        <div className="card">
          <h4>Upcoming</h4>
          <p>{events.length}</p>
        </div>

        <div className="card">
          <h4>Meetings</h4>
          <p>{events.length}</p>
        </div>

      </div>

      <div className="calendar-container">

        <div className="calendar">

          {renderHeader()}
          {renderDays()}
          {renderCells()}

        </div>

        {/* Event Panel */}

        <div className="event-panel">

          <h3>Events for {format(selectedDate, "PPP")}</h3>

          <input
            placeholder="Event title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />

          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
          />

          <textarea placeholder="Description" />

          <button onClick={addEvent}>
            Add Event
          </button>

        </div>

      </div>

    </div>
  );
}
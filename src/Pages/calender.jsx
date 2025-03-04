import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addYears,
  subYears,
} from "date-fns";
import TaskModal from "../components/taskModel";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const eventColors = {
  task: "#4CAF50",
  meeting: "#F321A6FF",
  deadline: "#FF9800",
  photoshoot: "#9C27B0",
};

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");
  const [selectedEventType, setSelectedEventType] = useState("task");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Expected an array but got:", data);
      }

      const formattedTasks = data.map((task) => ({
        id: task._id,
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.endDate || task.dueDate),
        type: task.eventType,
        color: eventColors[task.eventType] || "#000000",
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
    setModalOpen(true);
  };

  const moveDate = (direction) => {
    if (view === "month") {
      setCurrentDate(
        direction === "prev"
          ? subMonths(currentDate, 1)
          : addMonths(currentDate, 1)
      );
    } else if (view === "week") {
      setCurrentDate(
        direction === "prev"
          ? subWeeks(currentDate, 1)
          : addWeeks(currentDate, 1)
      );
    } else if (view === "year") {
      setCurrentDate(
        direction === "prev"
          ? subYears(currentDate, 1)
          : addYears(currentDate, 1)
      );
    }
  };

  return (
    <div>
      <div className="calendar-controls">
        <button onClick={() => moveDate("prev")}>Previous</button>
        <span>{format(currentDate, "MMMM yyyy")}</span>
        <button onClick={() => moveDate("next")}>Next</button>
        <select onChange={(e) => setView(e.target.value)} value={view}>
          <option value="month">Month</option>
          <option value="week">Week</option>
          <option value="year">Year</option>
        </select>
      </div>
      <Calendar
        className="calendar"
        localizer={localizer}
        events={tasks}
        selectable
        onSelectSlot={handleSelectSlot}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700, backgroundColor: "#000000", color: "white" }}
        views={{ month: true, week: true, day: true, agenda: true }}
        date={currentDate}
        onNavigate={setCurrentDate}
        eventPropGetter={(event) => ({
          style: { backgroundColor: event.color },
        })}
      />
      {modalOpen && (
        <TaskModal
          closeModal={() => setModalOpen(false)}
          selectedDate={selectedDate}
          refreshTasks={fetchTasks}
          eventType={selectedEventType}
          setEventType={setSelectedEventType}
        />
      )}
    </div>
  );
};

export default TaskCalendar;

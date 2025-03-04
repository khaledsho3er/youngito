import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
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

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tasks");
      const data = await response.json();
      console.log("API Response:", data); // Debugging output

      if (!Array.isArray(data)) {
        throw new Error("Expected an array but got:", data);
      }

      const formattedTasks = data.map((task) => ({
        id: task._id,
        title: task.title,
        start: new Date(task.dueDate),
        end: new Date(task.endDate || task.dueDate),
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

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={tasks}
        selectable
        onSelectSlot={handleSelectSlot}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
      />
      {modalOpen && (
        <TaskModal
          closeModal={() => setModalOpen(false)}
          selectedDate={selectedDate}
          refreshTasks={fetchTasks}
        />
      )}
    </div>
  );
};

export default TaskCalendar;

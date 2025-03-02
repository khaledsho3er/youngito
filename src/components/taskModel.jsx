import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const TaskModal = ({ closeModal, selectedDate, refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch("http://localhost:5000/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const handleSave = async () => {
    const taskData = {
      title,
      assignedTo,
      dueDate: selectedDate,
      endDate,
      priority,
    };

    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(taskData),
    });

    refreshTasks();
    closeModal();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Create Task</h3>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Assign to:</label>
        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Select an editor</option>
          {users.map((user) =>
            user.role === "Editor" ? (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ) : null
          )}
        </select>

        <label>Start Date:</label>
        <input
          type="date"
          value={format(selectedDate, "yyyy-MM-dd")}
          disabled
        />

        <label>End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <label>Priority:</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button onClick={handleSave}>Save</button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    </div>
  );
};

export default TaskModal;

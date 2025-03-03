import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const TaskModal = ({ closeModal, selectedDate, refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [assignedClient, setAssignedClient] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSave = async () => {
    const taskData = {
      title,
      assignedTo,
      assignedBy,
      assignedClient,
      startDate: format(selectedDate, "yyyy-MM-dd"),
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
    <div className="modal-overlay">
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
            user.role === "editor" ? (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ) : null
          )}
        </select>

        <label>Client:</label>
        <select
          value={assignedClient}
          onChange={(e) => setAssignedClient(e.target.value)}
        >
          <option value="">Select a client</option>
          {users.map((user) =>
            user.role === "client" ? (
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

        <div className="button-container">
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
          <button onClick={closeModal} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

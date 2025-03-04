import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const TaskModal = ({ closeModal, selectedDate, refreshTasks, userSession }) => {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("task");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedClient, setAssignedClient] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [description, setDescription] = useState("");
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
    if (!userSession || !userSession._id) {
      alert("User session is not available. Please log in again.");
      return;
    }

    if (!title || !description || !assignedTo) {
      alert("Please fill in all required fields!");
      return;
    }

    const taskData = {
      title,
      eventType,
      assignedTo,
      assignedBy: userSession._id, // Auto-assign the creator
      assignedClient,
      startDate: format(selectedDate, "yyyy-MM-dd"),
      dueDate: selectedDate,
      endDate: endDate ? format(new Date(endDate), "yyyy-MM-dd") : "",
      description,
      status,
      priority,
    };

    try {
      const response = await fetch("http://localhost:5000/api/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create task");
      }

      refreshTasks();
      closeModal();
    } catch (error) {
      console.error("Error creating task:", error);
      alert(error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create Event</h3>
          <img src="./Assets/blackYoung.png" alt="logo-young" />
        </div>
        <div className="form-grid">
          {/* Event Type & Title */}
          <div className="form-group">
            <label>Event Type:</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="task">Task</option>
              <option value="deadline">Deadline</option>
              <option value="shoot">Shoots</option>
              <option value="meeting">Meetings</option>
              <option value="event">Events</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          {/* Assigned To & Client */}
          <div className="form-group">
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
          </div>

          <div className="form-group">
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
          </div>

          {/* Start Date & End Date */}
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              disabled
            />
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Status & Priority */}
          <div className="form-group">
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Full Width Description */}
          <div className="form-group full-width">
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description here"
            />
          </div>
        </div>

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

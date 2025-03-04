import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { getAuth } from "firebase/auth";

const TaskModal = ({ closeModal, selectedDate, refreshTasks }) => {
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("task");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedClient, setAssignedClient] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [description, setDescription] = useState("");
  const [users, setUsers] = useState([]);
  const [userSession, setUserSession] = useState(null);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchClients(); // Fetch clients separately
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserSession(JSON.parse(storedUser));
    }
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/clients/");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserSession(JSON.parse(storedUser));
    }
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
    try {
      const auth = getAuth(); // Initialize Firebase Auth
      const user = auth.currentUser; // Get the logged-in user

      if (!user) {
        console.error("No user found!");
        return;
      }

      const token = await user.getIdToken(); // Get fresh Firebase ID token
      console.log("Sending Token:", token); // Debugging: Check if token is valid

      const taskData = {
        title: "New Task",
        description: "Task description...",
        assignedTo: "someUserId", // Replace with actual user ID
      };

      const response = await fetch("http://localhost:5000/api/tasks/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ensure "Bearer" prefix
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }

      console.log("Task created successfully!", data);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  console.log("User session:", userSession);
  console.log("User Firebase UID:", userSession?.firebaseUID);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create Event</h3>
          <p>{userSession && userSession.name}</p>
          <img src="./Assets/blackYoung.png" alt="logo-young" />
        </div>
        <div className="form-grid">
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
              {clients.map((client) => (
                <option key={clients._id} value={clients._id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

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

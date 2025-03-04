import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/login";
import Register from "./Pages/register";
import Home from "./Pages/home";
import TaskCalendar from "./Pages/calender";
import AuthProvider from "./utils/authContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/home" element={<Home />} />
            <Route path="/calender" element={<TaskCalendar />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

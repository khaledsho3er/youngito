import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/login";
import Register from "./Pages/register";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />  
        <Route path="/signup" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;

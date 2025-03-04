import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const Home = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored User:", storedUser); // Debugging

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || "Guest");
    }
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: "black",
        alignItems: "center",
      }}
      className="login-form"
    >
      <img
        src="./Assets/young-logo-white.png"
        alt="logo"
        className="login-logo"
      />
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontFamily: "FormulaBold",
          color: "white",
          fontSize: "12rem",
          textAlign: "center",
          alignSelf: "center",
          marginTop: "5%",
        }}
      >
        Welcome, {userName}! 👋
      </Typography>
    </div>
  );
};

export default Home;

import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import { login, signup } from "../utils/firebaseAuth"; // Import Firebase auth functions

import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion"; // Import Framer Motion
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
const AuthForm = ({ isSignUp }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    username: isSignUp
      ? Yup.string().required("Username is required")
      : Yup.string(),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    phoneNumber: isSignUp
      ? Yup.string().required("Phone number is required")
      : Yup.string(),
  });
  // const validationSchema = Yup.object({
  //   username: isSignUp
  //     ? Yup.string().required("Username is required")
  //     : Yup.string(),

  //   email: Yup.string()
  //     .email("Invalid email format")
  //     .matches(
  //       /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  //       "Invalid email format"
  //     )
  //     .required("Email is required"),

  //   password: Yup.string()
  //     .min(8, "Password must be at least 8 characters")
  //     .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  //     .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  //     .matches(/\d/, "Password must contain at least one number")
  //     .matches(/[@$!%*?&]/, "Password must contain at least one special character")
  //     .required("Password is required"),

  //   phoneNumber: isSignUp
  //     ? Yup.string()
  //         .matches(/^\+?[1-9]\d{9,14}$/, "Invalid phone number")
  //         .required("Phone number is required")
  //     : Yup.string(),
  // });

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "", phoneNumber: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        let token;
        if (isSignUp) {
          token = await signup(values.email, values.password); // Get Firebase Token

          // Send user data to backend with Firebase token
          await axios.post(
            "http://localhost:5000/api/users/register",
            {
              email: values.email,
              name: values.username,
              role: "manager",
              status: "active",
              phoneNumber: values.phoneNumber,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          alert("Signed up successfully!");
        } else {
          token = await login(values.email, values.password); // Get Firebase Token
          alert("Logged in successfully!");
        }

        localStorage.setItem("token", token); // Store Firebase Token
        navigate("/sidebar#");
      } catch (error) {
        alert("Authentication failed: " + error.message);
      } finally {
        setLoading(false);
      }
    },
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} className="glass-container">
        <motion.img
          src="Assets/youngitooo-12.png"
          width={"50%"}
          height={"50%"}
          style={{ marginRight: "40px" }}
          animate={{
            y: [0, -10, 0], // Moves up and down
            rotate: [0, 5, -5, 0], // Slight rotation effect
          }}
          transition={{
            duration: 2,
            repeat: Infinity, // Makes animation loop
            ease: "easeInOut",
          }}
        />

        <Typography
          variant="h5"
          sx={{
            marginBottom: 2,
            margin: "auto",
            color: "white",
            fontFamily: "FormulaBold",
          }}
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </Typography>
        <Box
          component="form"
          className="form-auth"
          onSubmit={formik.handleSubmit}
        >
          {isSignUp && (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Username"
                name="username"
                className="custom-textfield"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
              <TextField
                fullWidth
                margin="normal"
                label="phoneNumber"
                name="phoneNumber"
                className="custom-textfield"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                error={
                  formik.touched.phoneNumber &&
                  Boolean(formik.errors.phoneNumber)
                }
                helperText={
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                }
              />
            </>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            className="custom-textfield"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            className="custom-textfield"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button type="submit" fullWidth className="auth-btn">
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{ marginTop: 2, cursor: "pointer", color: "white" }}
          component={Link}
          to={isSignUp ? "/" : "/signup"}
        >
          {isSignUp
            ? "Already have an account?Sign In"
            : "Don't have an account? Sign Up"}
        </Typography>
      </Paper>
    </Container>
  );
};

export default AuthForm;

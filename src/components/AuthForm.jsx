import React from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion"; // Import Framer Motion

const AuthForm = ({ isSignUp }) => {
  // Validation Schema (Using Yup)
  const validationSchema = Yup.object({
    username: isSignUp
      ? Yup.string().required("Username is required")
      : Yup.string(),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  // Formik Form Handler
  const formik = useFormik({
    initialValues: { username: "", email: "", password: "" },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Data:", values);
      alert(isSignUp ? "Signed Up Successfully!" : "Logged In Successfully!");
    },
  });

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
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
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
        {/* <Typography
          variant="body2"
          sx={{ marginTop: 2, cursor: "pointer", color: "white" }}
          component={Link}
          to={isSignUp ? "/" : "/signup"}
        >
          {isSignUp
            ? "Already have an account?Sign In"
            : "Don't have an account? Sign Up"}
        </Typography> */}
      </Paper>
    </Container>
  );
};

export default AuthForm;

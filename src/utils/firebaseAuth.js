import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebaseConfig";

// Backend API URL
const BACKEND_URL = "http://localhost:5000/api/users"; // Change this to your backend URL

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken(); // Get Firebase ID Token

    // Send token to backend for user registration
    const response = await fetch(`${BACKEND_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Send token in headers
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

// Login Function
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken(); // Firebase ID Token

    // Fetch user data from MongoDB
    const response = await fetch(
      "http://localhost:5000/api/users/check-session",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();

    // Store session in localStorage
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", token);

    return data.user; // Return user details
  } catch (error) {
    throw error;
  }
};

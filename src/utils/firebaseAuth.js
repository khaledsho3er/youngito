import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await userCredential.user.getIdToken(); // Firebase JWT token
  } catch (error) {
    console.error("Login Error:", error.message);
  }
};

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return await userCredential.user.getIdToken(); // Firebase JWT token
  } catch (error) {
    console.error("Signup Error:", error.message);
  }
};

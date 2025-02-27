import React from "react";
import AuthForm from "../components/AuthForm";

const Register = () => {
  return (
    <div className="page-red">
      <div className="login-form">
        <img
          src="./Assets/young-logo-white.png"
          alt="logo"
          className="login-logo"
        />
        <AuthForm isSignUp={true} />
      </div>
    </div>
  );
};

export default Register;

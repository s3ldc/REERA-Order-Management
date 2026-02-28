import React from "react";
import AuthLayout from "./auth/AuthLayout";
import LoginForm from "./auth/LoginForm";

interface LoginProps {
  onShowSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onShowSignup }) => {
  return (
    <AuthLayout variant="login">
      <LoginForm onShowSignup={onShowSignup} />
    </AuthLayout>
  );
};

export default Login;

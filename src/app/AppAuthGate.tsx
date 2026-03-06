import React, { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";

const AppAuthGate: React.FC = () => {
  const [showSignup, setShowSignup] = useState(false);

  return showSignup ? (
    <Signup onBackToLogin={() => setShowSignup(false)} />
  ) : (
    <Login onShowSignup={() => setShowSignup(true)} />
  );
};

export default AppAuthGate;
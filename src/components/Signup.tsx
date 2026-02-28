import AuthLayout from "./auth/AuthLayout";
import SignupForm from "./auth/SignupForm";

interface SignupProps {
  onBackToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onBackToLogin }) => {
  return (
    <AuthLayout>
      <SignupForm onBackToLogin={onBackToLogin} />
    </AuthLayout>
  );
};

export default Signup;
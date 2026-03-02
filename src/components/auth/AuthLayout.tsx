import AuthBrandPanel from "./AuthBrandPanel";

interface AuthLayoutProps {
  children: React.ReactNode;
  variant: "login" | "signup";
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, variant }) => {
  return (
    <div className="h-[100dvh] w-full bg-[#020617] flex overflow-hidden">
      <AuthBrandPanel variant={variant} />
      <div className="flex-1 flex items-center justify-center px-6 sm:p-10 relative">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
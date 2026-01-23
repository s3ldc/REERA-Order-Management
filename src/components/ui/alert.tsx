import React from 'react';

interface AlertProps {
  children: ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-4 rounded-lg border border-blue-200 bg-blue-50 ${className}`}>
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`text-sm text-blue-800 ${className}`}>
      {children}
    </div>
  );
};
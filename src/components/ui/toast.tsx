import React from 'react';
import { useToast } from '../../hooks/useToast';

const Toast: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg border max-w-sm ${
            toast.variant === 'destructive'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          {toast.title && (
            <h4 className="font-semibold mb-1">{toast.title}</h4>
          )}
          {toast.description && (
            <p className="text-sm">{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Toast;
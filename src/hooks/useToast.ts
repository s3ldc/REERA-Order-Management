import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const ToastContext = createContext<any>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toastData: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { id, ...toastData };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const contextValue = {
    toasts,
    toast: addToast,
    dismiss: removeToast
  };

  return React.createElement(
    ToastContext.Provider,
    { value: contextValue },
    children,
    React.createElement(ToastContainer)
  );
};

const ToastContainer = () => {
  const context = useContext(ToastContext);
  if (!context) return null;
  
  const { toasts, dismiss } = context;

  return React.createElement(
    'div',
    { className: 'fixed top-4 right-4 z-50 space-y-2' },
    toasts.map((toast: Toast) =>
      React.createElement(
        'div',
        {
          key: toast.id,
          className: `p-4 rounded-lg shadow-lg border max-w-sm ${
            toast.variant === 'destructive'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-green-50 border-green-200 text-green-900'
          }`
        },
        React.createElement(
          'div',
          { className: 'flex justify-between items-start' },
          React.createElement(
            'div',
            null,
            React.createElement('h4', { className: 'font-semibold' }, toast.title),
            toast.description && React.createElement('p', { className: 'text-sm mt-1 opacity-90' }, toast.description)
          ),
          React.createElement(
            'button',
            {
              onClick: () => dismiss(toast.id),
              className: 'ml-4 text-lg leading-none opacity-70 hover:opacity-100'
            },
            '×'
          )
        )
      )
    )
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
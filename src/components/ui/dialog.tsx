import React, { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

interface DialogContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dialog: React.FC<DialogProps> = ({ children, open, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open !== undefined ? open : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger: React.FC<{ children: ReactNode; asChild?: boolean }> = ({ 
  children, 
  asChild = false 
}) => {
  const { setIsOpen } = useDialog();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => setIsOpen(true),
    });
  }

  return (
    <button onClick={() => setIsOpen(true)}>
      {children}
    </button>
  );
};

export const DialogPortal: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isOpen } = useDialog();
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {children}
    </div>
  );
};

export const DialogOverlay: React.FC<{ className?: string }> = ({ className }) => {
  const { setIsOpen } = useDialog();

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80",
        className
      )}
      onClick={() => setIsOpen(false)}
    />
  );
};

export const DialogContent: React.FC<{ 
  children: ReactNode; 
  className?: string;
  onClose?: () => void;
}> = ({ children, className, onClose }) => {
  const { setIsOpen } = useDialog();

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg",
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </DialogPortal>
  );
};

export const DialogHeader: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
    {children}
  </div>
);

export const DialogFooter: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}>
    {children}
  </div>
);

export const DialogTitle: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
    {children}
  </h2>
);

export const DialogDescription: React.FC<{ children: ReactNode; className?: string }> = ({ 
  children, 
  className 
}) => (
  <p className={cn("text-sm text-gray-500", className)}>
    {children}
  </p>
);

const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
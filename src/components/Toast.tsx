import React from 'react';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />,
    info: <Info className="w-4 h-4 text-accent shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-ink shrink-0" />,
  };

  return (
    <div className="toast-pill animate-in fade-in slide-in-from-bottom-2 duration-200 fixed bottom-6 right-6 z-50">
      {icons[type]}
      <span className="text-body-sm">{message}</span>
    </div>
  );
};
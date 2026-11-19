import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#121316] border border-[#22252b] text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-[#4d8eff] shrink-0" />
      ) : (
        <Info className="w-4 h-4 text-[#3ecf8e] shrink-0" />
      )}
      <span className="font-medium">{message}</span>
    </div>
  );
};

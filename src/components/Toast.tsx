import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#26271a] border border-[#434630] text-white text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-[#D96846] shrink-0" />
      ) : (
        <Info className="w-4 h-4 text-[#596235] shrink-0" />
      )}
      <span className="font-medium text-[#CDCBD6]">{message}</span>
    </div>
  );
};

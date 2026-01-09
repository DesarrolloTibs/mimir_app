// src/components/Modal/Modal.tsx

import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string; // Optional maxWidth prop
  height?: string; // Optional height prop
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, maxWidth = 'max-w-2xl', height = 'h-auto' }) => {
  if (!open) return null;

  const modalClasses = `relative p-5 border w-full ${maxWidth} ${height} shadow-lg rounded-md bg-white transform transition-all duration-300 ease-out scale-95 opacity-0`;
  
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className={modalClasses}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        style={{
          transform: open ? 'scale(1) opacity(1)' : 'scale(0.95) opacity(0)',
          transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
          opacity: open ? '1' : '0',
          animation: 'modal-fade-in 0.3s forwards',
        }}
      >
        <div className="flex justify-between items-center pb-3">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="mt-2 text-gray-700">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes modal-fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Modal;

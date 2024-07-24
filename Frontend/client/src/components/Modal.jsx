import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white p-4 rounded-lg shadow-md max-w-md w-full max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-gray-500 hover:bg-gray-600 rounded text-white"
        >
          X
        </button>
        <div className="pt-8"> {children}</div>
      </div>
    </div>
  );
};

export default Modal;

import React from "react";

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-black/9 rounded-lg shadow-lg p-6 z-50 max-w-lg w-full">
        <button
          className="absolute top-0 right-0 mt-2 mr-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

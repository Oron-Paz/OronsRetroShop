// components/Notification.js
import React from 'react';

const Notification = ({ message, onClose }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-stone-800 px-7 py-2 rounded-lg shadow-lg">
      <p>{message}</p>
      <button onClick={onClose} className="absolute top-1 right-2 text-stone-800">&times;</button>
    </div>
  );
};

export default Notification;
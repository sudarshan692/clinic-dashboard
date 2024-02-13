import React, { useState, useEffect } from 'react';

const CustomSnackbar = ({ message, duration, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setVisible(false);
      onClose();
    }, duration || 3000);

    return () => clearTimeout(timeoutId);
  }, [duration, onClose, message]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#333',
        color: '#fff',
        padding: '15px',
        borderRadius: '5px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{message}</span>
      <span
        style={{
          cursor: 'pointer',
          color: '#3f51b5',
          paddingLeft: '20px',
          fontWeight: 'bold'
        }}
        onClick={() => {
          setVisible(false);
          onClose();
        }}
      >
        Close
      </span>
    </div>
  );
};

export default CustomSnackbar;

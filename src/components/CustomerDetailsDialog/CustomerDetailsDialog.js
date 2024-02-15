// CustomerDetailsDialog.js

import React from "react";
import Modal from 'react-modal';


const CustomerDetailsDialog = ({ isOpen, onRequestClose, customerDetails }) => {
  // Customize your modal styles here
  const customStyles = {
    content: {
      width: '500px',
      height: '500px',
      margin: 'auto',
      padding: '15px',
      borderRadius: '10px',
      backgroundColor: '#ffffff',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Customer Details"
      style={customStyles}
      onRequestClose={onRequestClose}
    >
      <h2>Customer Details</h2>
      {customerDetails && (
        <div>
          <p><strong>Customer ID:</strong> {customerDetails.customerID || 'N/A'}</p>
          <p><strong>Name:</strong> {customerDetails.name  || 'N/A'}</p>
          <p><strong>Mobile Number:</strong> {customerDetails.mobile  || 'N/A'}</p>
          <p><strong>Place:</strong> {customerDetails.place  || 'N/A'}</p>
          <p><strong>Age:</strong> {customerDetails.age  || 'N/A'}</p>
          <p><strong>Total Cost:</strong> {customerDetails.totalCost  || 'N/A'}</p>
          <p><strong>Address:</strong> {customerDetails.address || 'N/A'}</p>
          <p><strong>Start Date:</strong> {customerDetails.startDate || 'N/A'}</p>
          <p><strong>End Date:</strong> {customerDetails.endDate || 'N/A'}</p>
          <p><strong>Status:</strong> {customerDetails.status || 'N/A'}</p>
          <p><strong>Payments Done:</strong></p>
          <ul>
    {customerDetails.payments?.length > 0 ? (
      customerDetails.payments.map((payment, index) => (
        <li key={index}>
         <strong>Amount:</strong> {payment.amount}, <strong>Date:</strong> {payment.date}, <strong>Time:</strong> {payment.time}
        </li>
      ))
    ) : (
      <li>No payments available</li>
    )}
  </ul>
        </div>
      )}
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default CustomerDetailsDialog;

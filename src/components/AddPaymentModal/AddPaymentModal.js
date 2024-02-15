import React, { useState } from 'react';
import Modal from 'react-modal';
import { db, firebase } from '../shared/firebase';
import './addPaymentModal.css';

const AddPaymentModal = ({ isOpen, onRequestClose, selectedCustomer, onPaymentAdded }) => {
  const [paymentAmount, setPaymentAmount] = useState('');

  const handleInputChange = (e) => {
    setPaymentAmount(e.target.value);
  };

  const handleSave = async () => {
    try {
      if (!paymentAmount) {
        // Handle validation or show an error message
        return;
      }
      // Update the 'payments' array in the customer document
      await db.collection('customers').doc(String(selectedCustomer.customerID)).update({
        payments: firebase.firestore.FieldValue.arrayUnion({
          amount: parseFloat(paymentAmount),
          date: new Date().toISOString(),
        }),
      });
      // Clear payment input box after successful save
      setPaymentAmount('');
      // Notify the parent component that a payment has been added
      onPaymentAdded();
      // Close the modal after successful save
      onRequestClose();
    } catch (error) {
      console.error('Error saving payment:', error.message);
    }
  };

    // Custom styles for the modal
    const customStyles = {
      content: {
        width: '500px', // Set your custom width here
        height: '250px', // Set your custom height here
        margin: 'auto', // Center the modal
        padding: '0', 
        overflow: 'auto', // Allow scrolling if content overflows
      },
    };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Payment Modal"
      style={customStyles}
    >
      <div className='maincard'>
      <h2  className='edit-customer-heading'>Add Payment</h2>
      <div className='container1'>
        <label className='all-label'> Payment Amount:
          <input className='payment-input' type="text" value={paymentAmount} onChange={handleInputChange}/>
        </label>
        <div>
        <button class="right-bottom-button-cancel" onClick={onRequestClose}>Cancel</button>
      </div>
      <div>
        <button  class="right-bottom-button-save" onClick={handleSave}>Save</button>
      </div>
      </div>
      </div>
    </Modal>
  );
};

export default AddPaymentModal;

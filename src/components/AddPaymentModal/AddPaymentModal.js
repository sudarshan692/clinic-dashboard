import React, { useState } from 'react';
import Modal from 'react-modal';
import { db, firebase } from '../shared/firebase';
import './addPaymentModal.css';

const AddPaymentModal = ({ isOpen, onRequestClose, selectedCustomer, onPaymentAdded }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setPaymentAmount(e.target.value);
    setErrorMessage(''); // Clear error message when the user types
  };

  const handleSave = async () => {
    try {
      if (!paymentAmount || !selectedCustomer) {
        setErrorMessage('Payment amount is required.');
        return;
      }

      const parsedAmount = parseFloat(paymentAmount);

      if (parsedAmount <= 0) {
        setErrorMessage('Payment amount must be greater than 0.');
        return;
      }

      const totalReceivedAmount = selectedCustomer.payments
        ? selectedCustomer.payments.reduce((acc, payment) => acc + payment.amount, 0)
        : 0;

      if (totalReceivedAmount + parsedAmount > selectedCustomer.totalCost) {
        setErrorMessage('Total amount received is greater than or equal to total cost.');
        return;
      }

      // Update the 'payments' array in the customer document
      await db.collection('customers').doc(String(selectedCustomer.customerID)).update({
        payments: firebase.firestore.FieldValue.arrayUnion({
          amount: parsedAmount,
          date: new Date().toLocaleDateString('en-IN'), // Indian date format
          time: new Date().toLocaleTimeString('en-IN'), // Indian time format
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
      height: '300px', // Set your custom height here
      margin: 'auto', // Center the modal
      padding: '0',
      overflow: 'auto', // Allow scrolling if content overflows
    },
  };

  // If selectedCustomer is null, return an empty modal or handle it accordingly
  if (!selectedCustomer) {
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Add Payment Modal"
        style={customStyles}
      >
        <div>No customer selected</div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Payment Modal"
      style={customStyles}
    >
      <div className='maincard'>
        <h2 className='edit-customer-heading'>Add Payment</h2>
        <div className='container1'>
          <label className='all-label'> Payment Amount:
            <input className='payment-input' type="text" value={paymentAmount} onChange={handleInputChange}  disabled={selectedCustomer.endDate !== ''} />
          </label>
          <div>
            <button class="right-bottom-button-cancel" onClick={onRequestClose}>Cancel</button>
          </div>
          <div>
            <button
              class="right-bottom-button-save"
              onClick={handleSave}
              disabled={selectedCustomer.endDate !== '' || !!errorMessage} // Disable if endDate is not an empty string or if there is an error message
            >
              Save
            </button>
          </div>
        </div>
        {errorMessage && (
          <div className='error-message'>
            {errorMessage}
          </div>
        )}
        {selectedCustomer.endDate !== '' && (
          <div className='alert-message'>
            Cannot add payment, since End Date is added...
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AddPaymentModal;

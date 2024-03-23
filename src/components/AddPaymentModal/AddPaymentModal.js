import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db, firebase } from '../shared/firebase';
import './addPaymentModal.css';

const AddPaymentModal = ({ isOpen, onRequestClose, selectedCustomer, onPaymentAdded }) => {
  const [paymentAmount, setPaymentAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Add state to track saving state

  useEffect(() => {
    setIsModalOpen(isOpen);

    if (!isOpen) {
      setPaymentAmount('');
      setErrorMessage('');
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    setPaymentAmount(e.target.value);
    setErrorMessage('');
  };

  const handleSave = async () => {
    if (isSaving) return; // Do nothing if already saving

    try {
      setIsSaving(true); // Set saving state to true
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

      await db.collection('customers').doc(String(selectedCustomer.customerID)).update({
        payments: firebase.firestore.FieldValue.arrayUnion({
          amount: parsedAmount,
          date: new Date().toLocaleDateString('en-IN'),
          time: new Date().toLocaleTimeString('en-IN'),
        }),
      });

      setPaymentAmount('');
      onPaymentAdded();
      onRequestClose();
    } catch (error) {
      console.error('Error saving payment:', error.message);
    } finally {
      setIsSaving(false); // Reset saving state regardless of success or failure
    }
  };

  const customStyles = {
    content: {
      width: '500px',
      height: '300px',
      margin: 'auto',
      padding: '0',
      overflow: 'auto',
    },
  };

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
      isOpen={isModalOpen}
      onRequestClose={() => {
        onRequestClose();
        setPaymentAmount('');
        setErrorMessage('');
      }}
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
            <button className="right-bottom-button-cancel" onClick={onRequestClose}>Cancel</button>
          </div>
          <div>
            <button
              className="right-bottom-button-save"
              onClick={handleSave}
              disabled={selectedCustomer.endDate !== '' || !!errorMessage || isSaving} // Disable if already saving or if there's an error
            >
              {isSaving ? 'Saving...' : 'Save'} {/* Change button text based on saving state */}
            </button>
          </div>
        </div>
        {errorMessage && (
          <div className='add-payment-error-message'>
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

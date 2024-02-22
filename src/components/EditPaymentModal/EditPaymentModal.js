import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../shared/firebase';



const EditPaymentModal = ({ isOpen, onRequestClose, selectedCustomer, selectedPayment, onPaymentUpdated }) => {
    const [editedAmount, setEditedAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    useEffect(() => {
      if (selectedPayment) {
        setEditedAmount(selectedPayment.amount.toString());
      } else {
        setEditedAmount('');
      }
      setErrorMessage('');
    }, [isOpen, selectedPayment]);
  
    const handleInputChange = (e) => {
      setEditedAmount(e.target.value);
      setErrorMessage('');
    };
  
    const handleUpdate = async () => {
      try {
        if (!editedAmount || !selectedCustomer || !selectedPayment) {
          setErrorMessage('Edited amount is required.');
          return;
        }
    
        const parsedAmount = parseFloat(editedAmount);
    
        if (parsedAmount <= 0) {
          setErrorMessage('Edited amount must be greater than 0.');
          return;
        }
    
        const updatedPayments = selectedCustomer.payments.map(payment =>
          payment === selectedPayment
            ? { ...payment, amount: parsedAmount, date: new Date().toLocaleDateString('en-IN'), time: new Date().toLocaleTimeString('en-IN') }
            : payment
        );
    
        const totalReceivedAmount = updatedPayments.reduce((acc, payment) => acc + payment.amount, 0);
    
        if (totalReceivedAmount >= selectedCustomer.totalCost) {
          setErrorMessage('Total amount received is greater than or equal to total cost.');
          return;
        }
    
        // Update the 'payments' array in the customer document
        await db.collection('customers').doc(String(selectedCustomer.customerID)).update({
          payments: updatedPayments,
        });
    
        // Notify the parent component that a payment has been updated
        onPaymentUpdated();
        window.location.reload();
        // Close the modal after successful update
        onRequestClose();
      } catch (error) {
        console.error('Error updating payment:', error.message);
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
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          onRequestClose();
          setEditedAmount('');
          setErrorMessage('');
        }}
        contentLabel="Edit Payment Modal"
        style={customStyles}
      >
        <div className='maincard'>
          <h2 className='edit-customer-heading'>Edit Payment</h2>
          <div className='container1'>
            <label className='all-label'> Edited Amount:
              <input className='payment-input' type="text" value={editedAmount} onChange={handleInputChange} />
            </label>
            <div>
              <button className="right-bottom-button-cancel" onClick={onRequestClose}>Cancel</button>
            </div>
            <div>
              <button
                className="right-bottom-button-save"
                onClick={handleUpdate}
                disabled={!!errorMessage}
              >
                Update
              </button>
            </div>
          </div>
          {errorMessage && (
            <div className='edit-payment-error-message'>
              {errorMessage}
            </div>
          )}
        </div>
      </Modal>
    );
  };
  
  export default EditPaymentModal;
  
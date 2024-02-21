import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../shared/firebase';
import '../EditCustomerModal/editCustomerModal.css';

const EditCustomerModal = ({ isOpen, onRequestClose, initialData, isMobileUnique, setIsMobileUnique, onEditSuccess, onCustomerEdited }) => {
  const [editedData, setEditedData] = useState({
    name: '',
    mobile: '',
    endDate: '',
    status: '',
  });

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setEditedData({ ...initialData });
  }, [initialData]);

  // Update initialData when it changes
  useEffect(() => {
    setErrorMessage(''); // Reset error message when initialData changes
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const isUnique = await checkMobileNumberUnique(editedData.mobile, initialData.uniqueID);
  
      if (isUnique) {
        if (editedData.startDate && editedData.endDate && new Date(editedData.endDate) <= new Date(editedData.startDate)) {
          setErrorMessage('End Date must be greater than Start Date');
          return;
        }
  
        const updatedData = {
          ...editedData,
          endDate: editedData.endDate || '',
          status: editedData.endDate ? 'Completed' : 'In Progress',
        };
  
        // Fetch payments data separately
        const paymentsSnapshot = await db.collection('customers').doc(initialData.uniqueID).get();
        const payments = paymentsSnapshot.data()?.payments || [];
  
        const totalReceivedAmount = payments.reduce((acc, payment) => acc + (parseFloat(payment.amount) || 0), 0);
        const editedTotalCost = parseFloat(editedData.totalCost) || 0;
  
        console.log('totalReceivedAmount:', totalReceivedAmount);
        console.log('editedTotalCost:', editedTotalCost);
  
        if (editedData.endDate && editedTotalCost !== totalReceivedAmount) {
          setErrorMessage('Cannot enter End Date since Customer has not done full payment');
          return;
        }
  
        console.log('Edited Data:', editedData); // Added console log
  
        await db.collection('customers').doc(initialData.uniqueID).update(updatedData);
        onEditSuccess();
        onCustomerEdited();
      } else {
        setIsMobileUnique(false);
      }
    } catch (error) {
      console.error('Error saving edited customer data:', error.message);
    }
  };
  
  

  const checkMobileNumberUnique = async (mobileNumber, currentUniqueID) => {
    try {
      const snapshot = await db
        .collection('customers')
        .where('mobile', '==', mobileNumber)
        .where('uniqueID', '!=', currentUniqueID)
        .get();

      return snapshot.empty;
    } catch (error) {
      console.error('Error checking mobile number uniqueness:', error.message);
      return false;
    }
  };

  useEffect(() => {
    // Reset error message when the modal is closed
    if (!isOpen) {
      setErrorMessage('');
    }
  }, [isOpen]);
  

  const customStyles = {
    content: {
      width: '1100px',
      height: '600px',
      margin: 'auto',
      padding: '0',
      overflow: 'auto',
    },
  };
  
  // JSX for rendering the EditCustomerModal component
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Customer Modal"
      style={customStyles} // Apply custom styles
    >
      <div className='maincard'>
        <h2 className='edit-customer-heading'>Edit Customer</h2>
        <p className='customerID'>CustomerID: {editedData.customerID}</p>
        <div className='container1'>
          <label className='all-label'>Name *
            <input className='inputbox1' type="text" name="name" value={editedData.name || ''} onChange={handleInputChange} />
          </label>
          <label className='all-label'>Mobile Number *
            <input className='inputbox1' type="text" name="mobile" value={editedData.mobile || ''} onChange={handleInputChange} />
            {isMobileUnique ? null : (
              <div style={{ color: 'red' }}>Mobile number must be unique</div>
            )}
          </label>
        </div>

        <div className='container1'>
          <label className='all-label'>Place *
            <input className='inputbox1' type="text" name="place" value={editedData.place || ''} onChange={handleInputChange} />
          </label>
          <label className='all-label'>Address *
            <input className='inputbox1' type="text" name="address" value={editedData.address || ''} onChange={handleInputChange} />
          </label>
        </div>

        <div className='container1'>
          <label className='all-label'>Age *
            <input className='inputbox1' type="text" name="age" value={editedData.age || ''} onChange={handleInputChange} />
          </label>
          <label className='all-label'>Total Cost *
            <input className='inputbox1' type="text" name="totalCost" value={editedData.totalCost || ''} onChange={handleInputChange} />
          </label>
        </div>
        <div className='container1'>
          <label className='all-label'>Start Date *
            <input className='inputbox1'type="date" name="startDate" value={editedData.startDate || ''} onChange={handleInputChange} />
          </label>
          <label className='all-label'>End Date *
            <input className='inputbox1' type="date" name="endDate" value={editedData.endDate || ''} onChange={handleInputChange} />
          </label>
        </div>
        <div>
          <button class="right-bottom-button-cancel" onClick={onRequestClose}>Cancel</button>
        </div>
        <div>
          <button class="right-bottom-button-save" onClick={handleSave}>Save</button>
        </div>
        {errorMessage && (
          <div className='error-message1'>
            {errorMessage}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default EditCustomerModal;

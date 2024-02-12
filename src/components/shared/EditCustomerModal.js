import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from './firebase';

const EditCustomerModal = ({ isOpen, onRequestClose, initialData, isMobileUnique, setIsMobileUnique, onEditSuccess }) => {
    // State variable to manage the edited customer data
    const [editedData, setEditedData] = useState({
      name: '',
      mobile: '',
      // ... other properties with default values
    });

  // Effect to update editedData when initialData changes
  useEffect(() => {
    setEditedData({ ...initialData });
  }, [initialData]);

  // Handle input changes in the edit modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle save button click in the edit modal
  const handleSave = async () => {
    try {
      // Check if the mobile number is unique
      const isUnique = await checkMobileNumberUnique(editedData.mobile, initialData.uniqueID);

      if (isUnique) {
        // Update the data with the specified document ID (uniqueID) within the customers collection
        await db.collection('customers').doc(initialData.uniqueID).update({
          // Include other customer data here
          ...editedData,
        });
        onEditSuccess(); // Callback to handle success and refetch data
      } else {
        // Handle case where mobile number is not unique
        setIsMobileUnique(false);
      }
    } catch (error) {
      console.error('Error saving edited customer data:', error.message);
    }
  };

  // Function to check if the mobile number is unique for the edited customer
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

   // Custom styles for the modal
   const customStyles = {
    content: {
      width: '50%', // Set your custom width here
      height: '70%', // Set your custom height here
      margin: 'auto', // Center the modal
      overflow: 'auto', // Allow scrolling if content overflows
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
      <h2>Edit Customer</h2>
      {/* Render input fields for each editable property */}
      <div>
        <label>Customer ID:</label>
        <span>{editedData.customerID}</span>
      </div>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={editedData.name || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Mobile Number:</label>
        <input type="text" name="mobile" value={editedData.mobile || ''} onChange={handleInputChange} />
        {isMobileUnique ? null : (
          <div style={{ color: 'red' }}>Mobile number must be unique</div>
        )}
      </div>
      <div>
        <label>Place:</label>
        <input type="text" name="place" value={editedData.place || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Address:</label>
        <input type="text" name="address" value={editedData.address || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Age:</label>
        <input type="text" name="age" value={editedData.age || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Total Cost:</label>
        <input type="text" name="totalCost" value={editedData.totalCost || ''} onChange={handleInputChange} />
      </div>
      <div>
        <label>Start Date:</label>
        <input type="date" name="startDate" value={editedData.startDate || ''} onChange={handleInputChange} />
      </div>

      {/* Include input fields for other editable properties (place, address, age, totalCost, startDate) */}
      {/* ... */}
      <div>
        <button onClick={handleSave}>Save</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};
export default EditCustomerModal;

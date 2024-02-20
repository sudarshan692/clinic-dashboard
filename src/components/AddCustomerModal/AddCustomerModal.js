import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../shared/firebase'; // Assuming you have a 'db' instance from Firebase

// Functional component for the Add Customer Modal
const AddCustomerModal = ({ isOpen, onRequestClose, isMobileUnique, setIsMobileUnique }) => {
  // State to manage customer data and initialize it with default values
  const [customerData, setCustomerData] = useState({
    customerID: '',
    name: '',
    mobile: '',
    place: '',
    address: '',
    age: '',
    totalCost: '',
    startDate: '',
  });

  // useEffect hook to fetch the maximum customer ID when the modal is opened
  useEffect(() => {
    const fetchMaxCustomerID = async () => {
      try {
        // Query the 'customers' collection to get the document with the maximum customerID
        const snapshot = await db
          .collection('customers')
          .orderBy('customerID', 'desc')
          .limit(1)
          .get();
        // Update the customerData state with the next customer ID
        if (!snapshot.empty) {
          const maxCustomerID = snapshot.docs[0].data().customerID;
          setCustomerData((prevData) => ({
            ...prevData,
            customerID: maxCustomerID + 1,
          }));
        } else {
          // No existing customers, set the initial customer ID to 1
          setCustomerData((prevData) => ({
            ...prevData,
            customerID: 1,
          }));
        }
      } catch (error) {
        console.error('Error fetching max customer ID:', error.message);
      }
    };
    // Call the fetchMaxCustomerID function when the modal is opened
    fetchMaxCustomerID();
  }, [isOpen]);


  // Event handler for input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  // Custom styles for the modal
  const customStyles = {
    content: {
      width: '1100px', // Set your custom width here
      height: '600px', // Set your custom height here
      margin: 'auto', // Center the modal
      padding: '0', 
      overflow: 'auto', // Allow scrolling if content overflows
    },
  };


  // Function to check the uniqueness of a mobile number in the 'customers' collection
  const checkMobileNumberUnique = async (mobileNumber) => {
    try {
      const snapshot = await db
        .collection('customers')
        .where('mobile', '==', mobileNumber)
        .get();
      // Return true if no matching documents found (mobile number is unique)
      return snapshot.empty;
    } catch (error) {
      console.error('Error checking mobile number uniqueness:', error.message);
      return false;
    }
  };


  // Function to handle saving customer data to the 'customers' collection
const handleSave = async () => {
  try {
    // Check if the mobile number is unique
    const isUnique = await checkMobileNumberUnique(customerData.mobile);

    if (isUnique) {
      // Save data with the specified document ID (customerID) and include customerID as a field
      await db.collection('customers').doc(String(customerData.customerID)).set({
        // Include other customer data here
        ...customerData,
        // Set default values for status and endDate for new customers
        status: 'In Progress',
        endDate: '',
      });
      // Clear input boxes after successful save
      setCustomerData({
        customerID: '',
        name: '',
        mobile: '',
        place: '',
        address: '',
        age: '',
        totalCost: '',
        startDate: '',
      });
      // Close the modal after successful save
      onRequestClose();
    } else {
      // Handle case where mobile number is not unique
      setIsMobileUnique(false);
    }
  } catch (error) {
    console.error('Error saving customer data:', error.message);
  }
};
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Add Customer Modal"
      style={customStyles} // Apply the custom styles
    >
      <div className='maincard'>
      <h2  className='edit-customer-heading'>Add Customer</h2>
      <p className='customerID'>CustomerID: {customerData.customerID}</p>

      <div className='container1'>
        <label className='all-label'>Name *
        <input className='inputbox1' type="text" name="name" value={customerData.name} onChange={handleInputChange} />
        </label>
        <label  className='all-label'>Mobile Number *
        <input className='inputbox1' type="text" name="mobile" value={customerData.mobile} onChange={handleInputChange} />
        {isMobileUnique ? null : (
        <div style={{ color: 'red' }}>Mobile number must be unique</div>
      )}     
      </label>
      </div>

      <div className='container1'>
        <label className='all-label'>Place *
        <input className='inputbox1' type="text" name="place" value={customerData.place} onChange={handleInputChange} />
        </label>
        <label className='all-label'>Address *
        <input className='inputbox1' type="text" name="address" value={customerData.address} onChange={handleInputChange} />
        </label>
      </div>

      <div className='container1'>
        <label className='all-label'>Age *
        <input className='inputbox1' type="text" name="age" value={customerData.age} onChange={handleInputChange} />
        </label>
        <label className='all-label'>Total Cost *
        <input className='inputbox1' type="text" name="totalCost" value={customerData.totalCost} onChange={handleInputChange} />
        </label>
      </div>

      <div className='container1'>
      <label className='all-label'>Start Date *
        <input className='inputbox1'type="date" name="startDate" value={customerData.startDate} onChange={handleInputChange} />
        </label>
      </div>
      <div>
        <button class="right-bottom-button-cancel" onClick={onRequestClose}>Cancel</button>
      </div>
      <div>
        <button  class="right-bottom-button-save" onClick={handleSave}>Save</button>
      </div>
      </div>
    </Modal>
  );
};

export default AddCustomerModal;

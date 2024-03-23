import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { db } from '../shared/firebase';
import '../EditCustomerModal/editCustomerModal.css';

const EditCustomerModal = ({ isOpen, onRequestClose, initialData, isMobileUnique, setIsMobileUnique, onEditSuccess, onCustomerEdited }) => {
  const [editedData, setEditedData] = useState({
    name: '',
    mobile: '',
    place: '',
    address: '',
    age: '',
    totalCost: '',
    startDate: '',
    endDate: '',
    status: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);


  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [placeError, setPlaceError] = useState("");
  // const [addressError, setAddressError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [totalCostError, setTotalCostError] = useState("");
  const [startDateError, setStartDateError] = useState("");

  useEffect(() => {
    if (isOpen) {
      resetErrors();
    }
  }, [isOpen]);

  useEffect(() => {
    setEditedData({ ...initialData });
  }, [initialData]);

  useEffect(() => {
    setErrorMessage(''); // Reset error message when initialData changes
    setHasUnsavedChanges(false); // Reset unsaved changes when initialData changes
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
     // Check if the current value is different from the initial value
     const isValueChanged = value !== initialData[name];
      // Set the flag to indicate unsaved changes
      setHasUnsavedChanges(isValueChanged);
  };

  const validateInputs = () => {
    let isValid = true;

    // Name validation
    if (!editedData.name.trim()) {
      setNameError("Name is required");
      isValid = false;
    } else {
      setNameError("");
    }

    // Mobile validation
    if (!editedData.mobile.trim()) {
      setMobileError("Mobile number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(editedData.mobile)) {
      setMobileError("Invalid mobile number");
      isValid = false;
    } else {
      setMobileError("");
    }

    // Place validation
    if (!editedData.place.trim()) {
      setPlaceError("Place is required");
      isValid = false;
    } else {
      setPlaceError("");
    }

    // // Address validation
    // if (!editedData.address.trim()) {
    //   setAddressError("Address is required");
    //   isValid = false;
    // } else {
    //   setAddressError("");
    // }

    // Age validation
    if (!editedData.age.trim()) {
      setAgeError("Age is required");
      isValid = false;
    } else if (isNaN(editedData.age) || parseInt(editedData.age) <= 0) {
      setAgeError("Invalid age");
      isValid = false;
    } else {
      setAgeError("");
    }

    // Total Cost validation
    if (!editedData.totalCost.trim()) {
      setTotalCostError("Total Cost is required");
      isValid = false;
    } else if (isNaN(editedData.totalCost) || parseFloat(editedData.totalCost) < 0) {
      setTotalCostError("Invalid total cost");
      isValid = false;
    } else {
      setTotalCostError("");
    }

    // Start Date validation
    if (!editedData.startDate.trim()) {
      setStartDateError("Start Date is required");
      isValid = false;
    } else {
      setStartDateError("");
    }

    return isValid;
  };

    // Function to reset errors
    const resetErrors = () => {
      setNameError('');
      setMobileError('');
      setPlaceError('');
      // setAddressError('');
      setAgeError('');
      setTotalCostError('');
      setStartDateError('');
    };

  const handleSave = async () => {
    try {
      resetErrors();
      if (!validateInputs()) {
        return;
      }
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
        // Reset the flag after saving
      setHasUnsavedChanges(false);
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
          <label className='all-label1'>Name *
            <input className='inputbox1' placeholder='Name' type="text" name="name" value={editedData.name || ''} onChange={handleInputChange} />
            <div className="error-messages">{nameError}</div>
          </label>
          <label className='all-label1'>Mobile Number *
            <input className='inputbox1' placeholder='Mobile Number' type="text" name="mobile" value={editedData.mobile || ''} onChange={handleInputChange} />
            {isMobileUnique ? null : (
              <div style={{ color: 'red' }}>Mobile number must be unique</div>
            )}
            <div className="error-messages">{mobileError}</div>  
          </label>
        </div>

        <div className='container1'>
          <label className='all-label1'>Place *
            <input className='inputbox1' placeholder='Place' type="text" name="place" value={editedData.place || ''} onChange={handleInputChange} />
            <div className="error-messages">{placeError}</div>  
          </label>
          <label className='all-label1'>Address
            <input className='inputbox1' placeholder='Address' type="text" name="address" value={editedData.address || ''} onChange={handleInputChange} />
               {/* <div className="error-messages">{addressError}</div>   */}
          </label>
        </div>

        <div className='container1'>
          <label className='all-label1'>Age *
            <input className='inputbox1' placeholder='Age' type="text" name="age" value={editedData.age || ''} onChange={handleInputChange} />
            <div className="error-messages">{ageError}</div> 
          </label>
          <label className='all-label1'>Total Cost *
            <input className='inputbox1' placeholder='Total Cost' type="text" name="totalCost" value={editedData.totalCost || ''} onChange={handleInputChange} />
            <div className="error-messages">{totalCostError}</div> 
          </label>
        </div>
        <div className='container1'>
          <label className='all-label1'>Start Date *
            <input className='inputbox1'type="date" name="startDate" value={editedData.startDate || ''} onChange={handleInputChange} />
            <div className="error-messages">{startDateError}</div> 
          </label>
          <label className='all-label1'>End Date *
            <input className='inputbox1' type="date" name="endDate" value={editedData.endDate || ''} onChange={handleInputChange} />
          </label>
        </div>
        <div>
          <button className="right-bottom-button-cancel" onClick={onRequestClose}>Cancel</button>
        </div>
        <div>
          <button className="right-bottom-button-save" onClick={handleSave} disabled={!hasUnsavedChanges}>Save</button>
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

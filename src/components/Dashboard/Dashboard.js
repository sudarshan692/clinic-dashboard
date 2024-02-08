// Import necessary dependencies from React and external libraries
import React, { useState, useEffect } from 'react';
import { auth, db } from '../shared/firebase';
import { useHistory } from 'react-router-dom';

// Import LoadingSpinner component for displaying a loading indicator
import LoadingSpinner from '../shared/LoadingSpinner';

// Import AddCustomerModal and CustomerTable components
import AddCustomerModal from '../shared/AddCustomerModel';
import CustomerTable from '../CustomerTable/CustomerTable';

// Functional component for the Dashboard page
const Dashboard = () => {
  // Initialize history hook for programmatic navigation
  const history = useHistory();

  // State variables for loading indicator, customer data, and modal status
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);

  // State variable for checking mobile number uniqueness during customer addition
  const [isMobileUnique, setIsMobileUnique] = useState(true);

  // Function to fetch customer data from the Firestore database
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Retrieve customer data from the 'customers' collection
      const snapshot = await db.collection('customers').get();
      // Map Firestore documents to an array of customer objects with unique IDs
      const customerData = snapshot.docs.map((doc) => ({
        uniqueID: doc.id,
        ...doc.data(),
      }));
      // Set the customer data state with the retrieved data
      setCustomers(customerData);
    } catch (error) {
      console.error('Error fetching customers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch customer data when the modal is opened or closed
  useEffect(() => {
    fetchCustomers();
  }, [isAddCustomerModalOpen]);

  // Function to handle user logout and redirect to the login page
  const handleLogout = async () => {
    try {
      setLoading(true);
      // Sign out the authenticated user using Firebase authentication
      await auth.signOut();
      // Redirect to the login page after a short delay (1 second)
      setTimeout(() => {
        history.push('/login');
      }, 1000);
      console.log('Logout successful');
    } catch (error) {
      console.error('Error logging out:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to open the Add Customer modal
  const openAddCustomerModal = () => {
    setIsAddCustomerModalOpen(true);
  };

  // Function to handle the deletion of a customer
  const handleDelete = (uniqueID) => {
    // Show alert for confirmation
    const userConfirmed = window.confirm('Are you sure you want to delete this customer?');
    // If user confirmed, proceed with deletion
    if (userConfirmed) {
      deleteCustomer(uniqueID); // Pass uniqueID to the deleteCustomer function
    }
  };

  // Function to delete a customer from the database
  const deleteCustomer = async (uniqueID) => {
    try {
      setLoading(true);
      // Check if the uniqueID is not empty or undefined
      if (uniqueID) {
        // Remove the customer from the database using the Firestore document ID
        await db.collection('customers').doc(uniqueID).delete();
        // Refetch the updated customer list
        fetchCustomers();
      } else {
        console.error('Error deleting customer: Invalid document ID');
      }
    } catch (error) {
      console.error('Error deleting customer:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to close the Add Customer modal
  const closeAddCustomerModal = () => {
    setIsMobileUnique(true);
    setIsAddCustomerModalOpen(false);
  };

  // JSX for rendering the Dashboard component
  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={openAddCustomerModal}>Add Customer</button>
      <button onClick={handleLogout}>Logout</button>
      {/* Display loading spinner if data is being fetched */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        // Display the CustomerTable component with customer data and onDelete function
        <CustomerTable data={customers} onDelete={handleDelete} />
      )}
      {/* Render the AddCustomerModal component with appropriate props */}
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onRequestClose={closeAddCustomerModal}
        isMobileUnique={isMobileUnique}
        setIsMobileUnique={setIsMobileUnique}
      />
    </div>
  );
};

// Export the Dashboard component as the default export for the module
export default Dashboard;

import React, { useState, useEffect } from "react";
import { auth, db } from "../shared/firebase";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";
import AddCustomerModal from "../shared/AddCustomerModel";
import CustomerTable from "../CustomerTable/CustomerTable";
import EditCustomerModal from "../shared/EditCustomerModal";
import './dashboard.css'
// Functional component for the Dashboard page
const Dashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState(null);
  const [isMobileUnique, setIsMobileUnique] = useState(true);

  // Function to fetch customer data from the Firestore database
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Retrieve customer data from the 'customers' collection
      const snapshot = await db.collection("customers").get();
      // Map Firestore documents to an array of customer objects with unique IDs
      const customerData = snapshot.docs.map((doc) => ({
        uniqueID: doc.id,
        ...doc.data(),
      }));
      // Set the customer data state with the retrieved data
      setCustomers(customerData);
    } catch (error) {
      console.error("Error fetching customers:", error.message);
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
        history.push("/login");
      }, 1000);
      console.log("Logout successful");
    } catch (error) {
      console.error("Error logging out:", error.message);
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
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );
    // If user confirmed, proceed with deletion
    if (userConfirmed) {
      deleteCustomer(uniqueID); // Pass uniqueID to the deleteCustomer function
    }
  };

  // Function to open the Edit Customer modal and set the current customer data
  const openEditCustomerModal = (customerData) => {
    setIsEditCustomerModalOpen(true);
    setEditCustomerData(customerData);
  };

  // Function to close the Edit Customer modal
  const closeEditCustomerModal = () => {
    setIsEditCustomerModalOpen(false);
    setEditCustomerData(null);
  };

  // Function to delete a customer from the database
  const deleteCustomer = async (uniqueID) => {
    try {
      setLoading(true);
      // Check if the uniqueID is not empty or undefined
      if (uniqueID) {
        // Remove the customer from the database using the Firestore document ID
        await db.collection("customers").doc(uniqueID).delete();
        // Refetch the updated customer list
        fetchCustomers();
      } else {
        console.error("Error deleting customer: Invalid document ID");
      }
    } catch (error) {
      console.error("Error deleting customer:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to close the Add Customer modal
  const closeAddCustomerModal = () => {
    setIsMobileUnique(true);
    setIsAddCustomerModalOpen(false);
  };

  // Function to handle the edit action
  const onEdit = (customerData) => {
    // Logic for handling the edit action
    console.log("Edit button clicked for:", customerData);
    openEditCustomerModal(customerData);
  };

 // JSX for rendering the Dashboard component
return (
  <div className="container">
    <h1 className="heading">Welcome to Piles Clinic Dashboard</h1>
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
    {loading ? (
      <div className="overlay">
        <LoadingSpinner />
      </div>
    ) : (
      // Display the CustomerTable component with customer data and onDelete function
      <CustomerTable data={customers} onDelete={handleDelete} onEdit={onEdit} />
    )}
    <button className="add-customer-btn" onClick={openAddCustomerModal}>Add Customer</button>
    <AddCustomerModal
      isOpen={isAddCustomerModalOpen}
      onRequestClose={closeAddCustomerModal}
      isMobileUnique={isMobileUnique}
      setIsMobileUnique={setIsMobileUnique}
    />
    <EditCustomerModal
      isOpen={isEditCustomerModalOpen}
      onRequestClose={closeEditCustomerModal}
      initialData={editCustomerData}
      isMobileUnique={isMobileUnique}
      setIsMobileUnique={setIsMobileUnique}
      onEditSuccess={() => {
        closeEditCustomerModal();
        fetchCustomers();
      }}
    />
  </div>
);

};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { auth, db } from "../shared/firebase";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";
import AddCustomerModal from "../AddCustomerModal/AddCustomerModal";
import CustomerTable from "../CustomerTable/CustomerTable";
import EditCustomerModal from "../EditCustomerModal/EditCustomerModal";
import "./dashboard.css";
import Modal from "react-modal";
import { CircularProgressbar } from "react-circular-progressbar";
import CustomerBarChart from "../CustomerBarChart/CustomerBarChart";
import CustomerSnackbar from '../shared/CustomerSnackbar';

const CustomAlert = ({ message, onConfirm, onCancel }) => {
  const customStyles = {
    content: {
      width: "400px",
      height: "150px",
      margin: "auto",
      padding: "15px",
      borderRadius: "10px",
      border: "10px",
      backgroundColor: "#0d2136",
      color: "white",
    },
  };
  return (
    <Modal isOpen={true} contentLabel="Custom Alert" style={customStyles}>
      <div>
        <h2 className="alert-heading">Confirm delete</h2>
        <p>{message}</p>
        <button className="confirm-alert-button" onClick={onConfirm}>
          Confirm
        </button>
        <button className="cancel-alert-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </Modal>
  );
};

// Functional component for the Dashboard page
const Dashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false);
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState(false);
  const [editCustomerData, setEditCustomerData] = useState(null);
  const [isMobileUnique, setIsMobileUnique] = useState(true);
  const [isCustomAlertOpen, setIsCustomAlertOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [totalCost, setTotalCost] = useState(0);
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [isBarGraphModalOpen, setIsBarGraphModalOpen] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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

      // Step 2: Calculate and set the total cost
      const totalCost = customerData.reduce(
        (acc, customer) => acc + Number(customer.totalCost),
        0
      );
      setTotalCost(totalCost);

      // Calculate the total amount received from payments for all customers
      const totalAmountReceived = customerData.reduce((acc, customer) => {
        const customerPaymentsTotal = customer.payments
          ? customer.payments.reduce(
              (paymentAcc, payment) => paymentAcc + payment.amount,
              0
            )
          : 0;
        return acc + customerPaymentsTotal;
      }, 0);

      setTotalAmountReceived(totalAmountReceived);

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

  const handleAddSnackbar = () => {
    // Set the state to show the snackbar
    setShowSnackbar(true);
    setSnackbarMessage("Customer Added Successfully!")
  };
  const handleDeleteSnackbar = () =>{
    // Set the state to show the snackbar
    setShowSnackbar(true);
    setSnackbarMessage("Customer Deleted Successfully!")
  }
  const handleEditSnackbar =() =>{
     // Set the state to show the snackbar
     setShowSnackbar(true);
     setSnackbarMessage("Customer Edited Successfully!")
  }
  // Function to format a number as Indian Rupees (INR)
  const formatAsIndianRupees = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Function to count the number of customers in progress, completed, and total customers
  const countCustomers = () => {
    const inProgressCount = customers.filter(
      (customer) => customer.status === "In Progress"
    ).length;
    const completedCount = customers.filter(
      (customer) => customer.status === "Completed"
    ).length;
    const totalCustomers = customers.length;
    return { inProgressCount, completedCount, totalCustomers };
  };

  // Function to calculate the percentage for circular progress bars
  const calculatePercentage = (count, total) => {
    return total === 0 ? 0 : (count / total) * 100;
  };

  // Calculate counts and total customers
  const { inProgressCount, completedCount, totalCustomers } = countCustomers();

  // Function to calculate the pending amount for all customers
  const calculatePendingAmount = () => {
    // Calculate the total pending amount for all customers
    const totalPendingAmount = customers.reduce((acc, customer) => {
      const receivedAmount = customer.payments
        ? customer.payments.reduce(
            (paymentAcc, payment) => paymentAcc + payment.amount,
            0
          )
        : 0;
      const pendingAmount = Math.max(customer.totalCost - receivedAmount, 0);
      return acc + pendingAmount;
    }, 0);
    return totalPendingAmount;
  };

  // Calculate total pending amount for all customers
  const totalPendingAmount = calculatePendingAmount();

  // Function to open the custom alert
  const openCustomAlert = (customer) => {
    setCustomerToDelete(customer);
    setIsCustomAlertOpen(true);
  };

  // Function to close the custom alert
  const closeCustomAlert = () => {
    setIsCustomAlertOpen(false);
    setCustomerToDelete(null);
  };

  // Function to open the Add Customer modal
  const openAddCustomerModal = () => {
    setIsAddCustomerModalOpen(true);
  };

  // Function to close the Add Customer modal
  const closeAddCustomerModal = () => {
    setIsMobileUnique(true);
    setIsAddCustomerModalOpen(false);
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

  // Function to handle the edit action
  const onEdit = (customerData) => {
    // Logic for handling the edit action
    console.log("Edit button clicked for:", customerData);
    openEditCustomerModal(customerData);
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
        handleDeleteSnackbar();
      } else {
        console.error("Error deleting customer: Invalid document ID");
      }
    } catch (error) {
      console.error("Error deleting customer:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Updated handleDelete function to use custom alert
  const handleDelete = (uniqueID) => {
    const customer = customers.find((c) => c.uniqueID === uniqueID);
    if (customer) {
      openCustomAlert(customer);
    }
  };

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

  // JSX for rendering the Dashboard component
  return (
    <div className="container">
      <h1 className="heading">Welcome to Piles Clinic Dashboard</h1>
      <button
        className="logout-btn"
        onClick={handleLogout}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#0d2136";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#3f51b5";
        }}
      >
        Logout
      </button>
      {loading ? (
        <div className="overlay">
          <LoadingSpinner />
        </div>
      ) : (
        // Display the CustomerTable component with customer data and onDelete function
        <CustomerTable
          data={customers}
          onDelete={handleDelete}
          onEdit={onEdit}
          onPaymentAdded={fetchCustomers}
        />
      )}
      {isCustomAlertOpen && (
        <CustomAlert
          message={`Are you sure want to delete customer ${customerToDelete.customerID}?`}
          onConfirm={() => {
            deleteCustomer(customerToDelete.uniqueID);
            closeCustomAlert();
          }}
          onCancel={closeCustomAlert}
        />
      )}

      <div className="progress-bar-container1">
        <CircularProgressbar
          className="circle"
          value={calculatePercentage(inProgressCount, totalCustomers)}
          text={`${Math.round(
            calculatePercentage(inProgressCount, totalCustomers)
          )}%`}
          styles={{
            path: {
              stroke: "orange",
              strokeWidth: 9, // Adjust the width of the colored part
            },
            trail: {
              stroke: "black", // Background color
              strokeWidth: 9, // Adjust the width of the background
            },
            text: {
              fill: "#fff",
              fontSize: "25px",
              dominantBaseline: "middle", // Vertical centering
              textAnchor: "middle", // Horizontal centering
            },
          }}
          strokeWidth={10}
        />
        <div>
          <p className="count-text">In Progress </p>
          <p className="inprogress-count">
            {inProgressCount} / {totalCustomers}
          </p>
        </div>
      </div>

      <div className="progress-bar-container2">
        <CircularProgressbar
          className="circle"
          value={calculatePercentage(completedCount, totalCustomers)}
          text={`${Math.round(
            calculatePercentage(completedCount, totalCustomers)
          )}%`}
          styles={{
            path: {
              stroke: "#16FF00",
              strokeWidth: 9, // Adjust the width of the colored part
            },
            trail: {
              stroke: "black", // Background color
              strokeWidth: 9, // Adjust the width of the background
            },
            text: {
              fill: "#fff",
              fontSize: "25px",
              dominantBaseline: "middle", // Vertical centering
              textAnchor: "middle", // Horizontal centering
            },
          }}
          strokeWidth={10}
        />
        <div>
          <p className="count-text">Completed </p>
          <p className="completed-count">
            {completedCount} / {totalCustomers}
          </p>
        </div>
      </div>

      <div className="progress-bar-container3">
        <CircularProgressbar
          className="circle"
          value={calculatePercentage(totalAmountReceived, totalCost)}
          text={`${Math.round(
            calculatePercentage(totalAmountReceived, totalCost)
          )}%`}
          styles={{
            path: {
              stroke: "#16FF00",
              strokeWidth: 9, // Adjust the width of the colored part
            },
            trail: {
              stroke: "black", // Background color
              strokeWidth: 9, // Adjust the width of the background
            },
            text: {
              fill: "#fff",
              fontSize: "25px",
              dominantBaseline: "middle", // Vertical centering
              textAnchor: "middle", // Horizontal centering
            },
          }}
          strokeWidth={10}
        />
        <div>
          <p className="count-text">Total Income Received </p>
          <p className="total-received-income">
            R: {formatAsIndianRupees(totalAmountReceived)}
          </p>
          <p className="total-income">T: {formatAsIndianRupees(totalCost)}</p>
        </div>
      </div>

      <div className="progress-bar-container6">
        <CircularProgressbar
          className="circle"
          value={calculatePercentage(totalPendingAmount, totalCost)}
          text={`${Math.round(
            calculatePercentage(totalPendingAmount, totalCost)
          )}%`}
          styles={{
            path: {
              stroke: "#FF4500",
              strokeWidth: 9, // Adjust the width of the colored part
            },
            trail: {
              stroke: "black", // Background color
              strokeWidth: 9, // Adjust the width of the background
            },
            text: {
              fill: "#fff",
              fontSize: "25px",
              dominantBaseline: "middle", // Vertical centering
              textAnchor: "middle", // Horizontal centering
            },
          }}
          strokeWidth={10}
        />
        <div>
          <p className="count-text">Total Pending Amount </p>
          <p className="total-income-pending">
            P: {formatAsIndianRupees(totalPendingAmount)}
          </p>
          <p className="total-income">T: {formatAsIndianRupees(totalCost)}</p>
        </div>
      </div>

      <button
        className="view-bar-graph-btn"
        onClick={() => setIsBarGraphModalOpen(true)}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#0d2136";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#3f51b5";
        }}
      >
        View Bar Graph
      </button>

      <button
        className="add-customer-btn"
        onClick={openAddCustomerModal}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#162c46";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#3f51b5";
        }}
      >
        Add Customer
      </button>

      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onRequestClose={closeAddCustomerModal}
        isMobileUnique={isMobileUnique}
        setIsMobileUnique={setIsMobileUnique}
        onCustomerAdded={handleAddSnackbar} 
      />
      <EditCustomerModal
        isOpen={isEditCustomerModalOpen}
        onRequestClose={closeEditCustomerModal}
        initialData={editCustomerData}
        isMobileUnique={isMobileUnique}
        setIsMobileUnique={setIsMobileUnique}
        onCustomerEdited={handleEditSnackbar} 
        onEditSuccess={() => {
          closeEditCustomerModal();
          fetchCustomers();
        }}
      />
      <Modal
        isOpen={isBarGraphModalOpen}
        onRequestClose={() => setIsBarGraphModalOpen(false)}
        contentLabel="Bar Graph Modal"
        style={{
          content: {
            width: "55%",
            height: "50%",
            margin: "auto",
            borderRadius: "10px",
            border: "10px",
            backgroundColor: "#0d2136",
            overflow: "hidden",
          },
        }}
      >
        <button
          style={{
            position: "absolute",
            top: "460px",
            right: "15px",
            backgroundColor: "#3f51b5",
            padding: "5px",
            borderWidth: "0px",
            borderRadius: "5px",
            width: "60px",
            fontSize: "12px",
            color: "#fff",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
          onClick={() => setIsBarGraphModalOpen(false)}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#162c46";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#3f51b5";
          }}
        >
          Close
        </button>
        <CustomerBarChart />
      </Modal>
      {showSnackbar && (
    <CustomerSnackbar
      message={snackbarMessage}
      duration={3000}
      onClose={() => setShowSnackbar(false)}
    />
  )}
    </div>
  );
};

export default Dashboard;

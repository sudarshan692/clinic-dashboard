import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./customerDetailsDialog.css";
import { CircularProgressbar } from "react-circular-progressbar";
import EditPaymentModal from "../EditPaymentModal/EditPaymentModal";

const CustomerDetailsDialog = ({ isOpen, onRequestClose, customerDetails }) => {
  const [totalReceivedAmount, setTotalReceivedAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    if (customerDetails && customerDetails.payments && customerDetails.payments.length > 0) {
      const receivedAmount = customerDetails.payments.reduce(
        (acc, payment) => acc + payment.amount,
        0
      );
      setTotalReceivedAmount(receivedAmount);
  
      const pending = Math.max(customerDetails.totalCost - receivedAmount, 0);
      setPendingAmount(pending);
    } else {
      // If payments array is empty or not present, set total received amount and pending amount to zero
      setTotalReceivedAmount(0);
  
      // Initialize pending amount to total cost for new customers
      setPendingAmount(customerDetails ? customerDetails.totalCost : 0);
    }
  }, [customerDetails]);

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setIsEditPaymentModalOpen(true);
  };

  const handleEditPaymentModalClose = () => {
    setIsEditPaymentModalOpen(false);
    setSelectedPayment(null);
  };

  const calculatePercentage = (value, total) => {
    return total && total !== 0 ? (value / total) * 100 : 0;
  };

  // Function to format a number as Indian Rupees (INR)
  const formatAsIndianRupees = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const customStyles = {
    content: {
      width: "800px",
      height: "550px",
      margin: "auto",
      padding: "0px",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel="Customer Details"
      style={customStyles}
      onRequestClose={onRequestClose}
    >
      <div className="maincard">
        <h2 className="customer-details">Customer Details</h2>
        <div className="details">
          {customerDetails && (
            <div>
              <p>
                <strong>Customer ID:</strong>{" "}
                {customerDetails.customerID || "N/A"}
              </p>

              <p>
                <strong>Name:</strong> {customerDetails.name || "N/A"}
              </p>
              <p>
                <strong>Mobile Number:</strong>{" "}
                {customerDetails.mobile || "N/A"}
              </p>
              <p>
                <strong>Place:</strong> {customerDetails.place || "N/A"}
              </p>
              <p>
                <strong>Age:</strong> {customerDetails.age || "N/A"}
              </p>
              <p>
                <strong>Total Cost:</strong>{" "}
                {customerDetails.totalCost || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {customerDetails.address || "N/A"}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {customerDetails.startDate || "N/A"}
              </p>
              <p>
                <strong>End Date:</strong> {customerDetails.endDate || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {customerDetails.status || "N/A"}
              </p>
              <p>
                <strong>Payments Done:</strong>
              </p>

              <div className="progress-bar-container4">
                <CircularProgressbar
                  className="circle"
                  value={calculatePercentage(
                    totalReceivedAmount,
                    customerDetails.totalCost
                  )}
                  text={`${Math.round(
                    calculatePercentage(
                      totalReceivedAmount,
                      customerDetails.totalCost
                    )
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
                      fontSize: "23px",
                      dominantBaseline: "middle", // Vertical centering
                      textAnchor: "middle", // Horizontal centering
                    },
                  }}
                  strokeWidth={10}
                />
                <div>
                  <p className="count-text">Income Received </p>
                  <p className="income-received">
                    R: {formatAsIndianRupees(totalReceivedAmount)}
                  </p>
                  <p className="total-income">
                    T: {formatAsIndianRupees(customerDetails.totalCost)}
                  </p>
                </div>
              </div>

              <div className="progress-bar-container5">
                <CircularProgressbar
                  className="circle"
                  value={calculatePercentage(
                    pendingAmount,
                    customerDetails.totalCost
                  )}
                  text={`${Math.round(
                    calculatePercentage(
                      pendingAmount,
                      customerDetails.totalCost
                    )
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
                      fontSize: "23px",
                      dominantBaseline: "middle", // Vertical centering
                      textAnchor: "middle", // Horizontal centering
                    },
                  }}
                  strokeWidth={10}
                />
                <div>
                  <p className="count-text">Pending Amount </p>
                  <p className="income-pending">
                    P: {formatAsIndianRupees(pendingAmount)}
                  </p>
                  <p className="total-income">
                    T: {formatAsIndianRupees(customerDetails.totalCost)}
                  </p>
                </div>
              </div>

              <div className="payment-list-container">
                <ul>
                  {customerDetails.payments?.length > 0 ? (
                    customerDetails.payments
                      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort payments by date in descending order
                      .map((payment, index) => (
                        <li key={index}>
                          <strong>Amount:</strong> {payment.amount},{" "}
                          <strong>Date:</strong> {payment.date},{" "}
                          <strong>Time:</strong> {payment.time}
                          <button onClick={() => handleEditPayment(payment)}>
                            Edit
                          </button>
                        </li>
                      ))
                  ) : (
                    <li>No payments available</li>
                  )}
                </ul>
              </div>
              {isEditPaymentModalOpen && (
                <EditPaymentModal
                  isOpen={isEditPaymentModalOpen}
                  onRequestClose={handleEditPaymentModalClose}
                  selectedCustomer={customerDetails}
                  selectedPayment={selectedPayment}
                  onPaymentUpdated={() => {}}
                />
              )}
            </div>
          )}
          <button className="close-button" onClick={onRequestClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetailsDialog;

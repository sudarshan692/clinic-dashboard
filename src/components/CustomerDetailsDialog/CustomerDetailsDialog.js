import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import "./customerDetailsDialog.css";
import { CircularProgressbar } from "react-circular-progressbar";
import EditPaymentModal from "../EditPaymentModal/EditPaymentModal";
import { db } from "../shared/firebase";

const CustomerDetailsDialog = ({ isOpen, onRequestClose, customerDetails }) => {
  const [totalReceivedAmount, setTotalReceivedAmount] = useState(0);
  const [pendingAmount, setPendingAmount] = useState(0);
  const [isEditPaymentModalOpen, setIsEditPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    if (
      customerDetails &&
      customerDetails.payments &&
      customerDetails.payments.length > 0
    ) {
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

  const formatAsIndianRupees = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleDeletePayment = async (paymentIndex) => {
    try {
      const customerID = String(customerDetails.customerID);

      // Get the current payments array
      const currentPayments = customerDetails.payments || [];

      // Remove the selected payment by index
      const updatedPayments = [
        ...currentPayments.slice(0, paymentIndex),
        ...currentPayments.slice(paymentIndex + 1),
      ];

      // Update the 'payments' array in the customer document
      await db.collection("customers").doc(customerID).update({
        payments: updatedPayments,
      });

      // Update local state to trigger a re-render
      setTotalReceivedAmount(
        updatedPayments.reduce((acc, payment) => acc + payment.amount, 0)
      );
      setPendingAmount(
        Math.max(customerDetails.totalCost - totalReceivedAmount, 0)
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting payment:", error.message);
    }
  };

  const customStyles = {
    content: {
      width: window.innerWidth < 768 ? "auto" : "802px",
      height: window.innerWidth < 768 ? "auto" : "600px",
      margin: window.innerWidth < 768 ? "5px" : "auto",
      marginBottom: window.innerWidth < 768 ? "230px" : "auto",
      marginLeft: window.innerWidth < 768 ? "-30px" : "auto",
      marginRight: window.innerWidth < 768 ? "-30px" : "auto",
      padding: "0",
      overflow: "auto",
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
        <h2 className="customer-details-heading">Customer Details</h2>
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
              <p className="mn">
                <strong>Mobile Number:</strong>{" "}
                {customerDetails.mobile || "N/A"}
              </p>
              <p className="mn">
                <strong>Place:</strong> {customerDetails.place || "N/A"}
              </p>
              <p className="mn">
                <strong>Age:</strong> {customerDetails.age || "N/A"}
              </p>
              <p className="mn">
                <strong>Total Cost:</strong>{" "}
                {formatAsIndianRupees(customerDetails.totalCost || 0)}
              </p>
              <p className="mn">
                <strong>Address:</strong> {customerDetails.address || "N/A"}
              </p>
              <p className="mn">
                <strong>Start Date:</strong>{" "}
                {customerDetails.startDate || "N/A"}
              </p>
              <p className="mn">
                <strong>End Date:</strong> {customerDetails.endDate || "N/A"}
              </p>
              <p className="mn">
                <strong>Status:</strong> {customerDetails.status || "N/A"}
              </p>
              <p className="mn">
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
                    <table className="payment-table">
                      <thead>
                        <tr>
                          <th>Amount</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Edit</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerDetails.payments
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((payment, index) => (
                            <tr key={index} className="payment-item">
                              <td>{formatAsIndianRupees(payment.amount)}</td>
                              <td>{payment.date}</td>
                              <td>{payment.time}</td>
                              <td>
                                <span
                                  className="material-icons edit-icon"
                                  onClick={() => handleEditPayment(payment)}
                                >
                                  edit
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`material-icons delete-icon${
                                    customerDetails.endDate ? " disabled" : ""
                                  }`}
                                  onClick={() =>
                                    !customerDetails.endDate &&
                                    handleDeletePayment(index)}
                                    title={customerDetails.endDate ? 'Cannot delete since, end date is entered.' : ''}
                                >
                                  delete
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-paymentData">No payments available</p>
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

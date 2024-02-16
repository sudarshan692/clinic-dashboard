import React from "react";
import Modal from "react-modal";
import "./customerDetailsDialog.css";

const CustomerDetailsDialog = ({ isOpen, onRequestClose, customerDetails }) => {
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

              <div className="payment-list-container">
                <ul>
                  {customerDetails.payments?.length > 0 ? (
                    customerDetails.payments.map((payment, index) => (
                      <li key={index}>
                        <strong>Amount:</strong> {payment.amount},{" "}
                        <strong>Date:</strong> {payment.date},{" "}
                        <strong>Time:</strong> {payment.time}
                      </li>
                    ))
                  ) : (
                    <li>No payments available</li>
                  )}
                </ul>
              </div>
            </div>
          )}
          <button className="close-button" onClick={onRequestClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomerDetailsDialog;

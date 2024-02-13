import React, { useState  } from "react";
import DataTable from "react-data-table-component";
import './customerTable.css';
import completedImage from '../../assets/completed.png';
import inProgressImage from '../../assets/inProgress.png';

const CustomerTable = ({ data, onDelete, onEdit }) => {
  const [searchText, setSearchText] = useState('');


  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) =>
        value && value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    { name: "Customer ID", selector: (row) => row.customerID, sortable: true },
    { name: "Name",  selector: (row) => row.name, sortable: true },
    { name: "Mobile Number", selector: (row) => row.mobile, sortable: true },
    { name: "Place", selector: (row) => row.place, sortable: true },
    { name: "Age", selector: (row) => row.age, sortable: true },
    { name: "Total Cost", selector: (row) => row.totalCost, sortable: true },
    { name: "Address", selector: (row) => row.address, sortable: true },
    { name: "Start Date", selector: (row) => row.startDate, sortable: true },
    { name: "End Date", selector: (row) => row.endDate || '-', sortable: true }, // Display 'N/A' if endDate is not available
    {
      name: "Status",
      cell: (row) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {row.endDate ? (
            <>
              <img
                src={completedImage}
                alt="Completed"
                style={{ width: "20px", height: "20px", marginRight: "8px" }}
              />
              <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                Completed
              </span>
            </>
          ) : (
            <>
              <img
                src={inProgressImage}
                alt="In Progress"
                style={{ width: "20px", height: "20px", marginRight: "8px" }}
              />
              <span style={{ display: "inline-block", verticalAlign: "middle" }}>
                In Progress
              </span>
            </>
          )}
        </div>
      ),
    },
    {
      name: "",
      cell: (row) => (
        <>
          <span
            className="material-icons"
            style={{ cursor: "pointer" }}
            onClick={() => onEdit(row)}
          >
            edit
          </span>
          <span
            className="material-icons"
            style={{ cursor: "pointer" }}
            onClick={() => onDelete(row.uniqueID)}
    
          >
            delete
          </span>
        </>
      ),
    },
  ];
  // Define custom styles for the DataTable component
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#3f51b5", // Header background color
        color: "white", // Header text color
        fontSize: "15px", // Header font size
        fontWeight: "bold", // Header font weight
      },
    },
    rows: {
      style: {
        "&:nth-child(odd)": {
          backgroundColor: "#e0e0e0",
        },
        "&:nth-child(even)": {
          backgroundColor: "#f2f2f2",
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: "#ecf0f1", // Pagination background color
        color: "#34495e", // Pagination text color
        display: "flex",
        justifyContent: "center",
      },
    },
    button: {
      style: {
        backgroundColor: "#3498db", // Button background color
        color: "white", // Button text color
      },
    },
  };
  
  return (
    <div>
      <div className="search-container">
        <input
        className="search-input"
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder="Search..."
        />
      </div>
      <div className="table">
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          highlightOnHover
          pointerOnHover
          sortIcon={<i className="material-icons">arrow_upward</i>}
          defaultSortField="customerID"
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default CustomerTable;

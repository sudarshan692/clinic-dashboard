// Import necessary dependencies from React and external libraries
import React from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';

// Functional component for displaying a table of customer data
const CustomerTable = ({ data, onDelete }) => {
  // Define the columns for the table using React.useMemo
  const columns = React.useMemo(
    () => [
      {Header: 'Customer ID',accessor: 'customerID'},
      {Header: 'Name',accessor: 'name'},
      {Header: 'Mobile Number',accessor: 'mobile'},
      {Header: 'Place',accessor: 'place'},
      {Header: 'Age',accessor: 'age'},
      {Header: 'Total Cost',accessor: 'totalCost'},
      {Header: 'Start Date',accessor: 'startDate'},
      {
        Header: 'Actions',
        accessor: 'actions',
        // Custom Cell component for the Actions column, with a delete button
        Cell: ({ row }) => (
          <button onClick={() => onDelete(row.original.uniqueID)}>Delete</button>
        ),
      },
    ],
    [onDelete]
  );

  // Use react-table hooks to set up table functionality
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    canNextPage,
    previousPage,
    canPreviousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    usePagination
  );

  // JSX for rendering the CustomerTable component
  return (
    <div>
      {/* Table element with props from react-table */}
      <table {...getTableProps()} className="customer-table">
        <thead>
          {/* Map over headerGroups to render the table headers */}
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Render each column header with sorting functionality
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  {/* Display sorting indicators */}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {/* Map over the rows in the current page and render each row */}
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {/* Map over cells in each row and render the cell content */}
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
                <td>
                  {/* Additional cell for actions, which includes the delete button */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Previous
        </button>
        <span>
          Page{' '}
          {/* Display current page and total pages */}
          <strong>
            {pageIndex + 1} of {Math.ceil(data.length / 10)}
          </strong>{' '}
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

// Export the CustomerTable component as the default export for the module
export default CustomerTable;

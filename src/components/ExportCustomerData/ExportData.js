import React from 'react';
import ExcelJS from 'exceljs';
import './exportData.css';

const ExportData = ({ data }) => {
  const generateColumns = (data) => {
    const paymentColumns = [];
    if (data && data.length > 0) {
      const maxPayments = Math.max(...data.map(item => (item.payments || []).length));
      for (let i = 0; i < maxPayments; i++) {
        paymentColumns.push({
          title: `Payment ${i + 1}`,
          dataIndex: `payments[${i}]`,
          render: (text, record) => {
            const payments = record.payments || [];
            const payment = i < payments.length ? payments[i] : {};
            return payment ? `${payment.amount} (${payment.date} ${payment.time})` : '';
          },
        });
      }
    }
    return paymentColumns;
  };
  
  
  
  
  
  
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Mobile Number', dataIndex: 'mobile' },
    { title: 'Place', dataIndex: 'place' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Age', dataIndex: 'age' },
    { title: 'Total Cost', dataIndex: 'totalCost' },
    { title: 'Start Date', dataIndex: 'startDate' },
    { title: 'End Date', dataIndex: 'endDate' },
    { title: 'Status', dataIndex: 'status' },
    // Generate payment columns dynamically
    ...generateColumns(data),
  ];

  const exportData = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Customer Data');
  
    // Add headers with blue background and bold text
    const headerRow = worksheet.addRow(columns.map(column => column.title));
    headerRow.eachCell(cell => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF3F51B5' }, // Blue background color
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' }, // White text color
      };
    });
  
    // Add data with alternate row colors
    data.forEach((item, index) => {
      const rowData = columns.map(column => {
        if (column.dataIndex.startsWith('payments')) {
          // Handle payment columns
          const paymentIndex = parseInt(column.dataIndex.match(/\[(\d+)\]/)[1], 10);
          const payments = item.payments || [];
          const payment = paymentIndex < payments.length ? payments[paymentIndex] : {};
          return payment && payment.amount ? `${payment.amount} (${payment.date} ${payment.time})` : '-';
        } else {
          return item[column.dataIndex] !== undefined ? item[column.dataIndex] : '-';
        }
      });
  
      const row = worksheet.addRow(rowData);
  
      // Set alternate row colors
      if (index % 2 === 0) {
        row.eachCell(cell => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }, // Alternate row color
          };
        });
      }
    });
  
    // Adjust column sizes based on content
    worksheet.columns.forEach(column => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, cell => {
        const length = cell.value ? cell.value.toString().length : 10;
        if (length > maxLength) {
          maxLength = length;
        }
      });
      column.width = maxLength < 10 ? 10 : maxLength + 2;
  
      // Center-align the data in the column
      column.alignment = { horizontal: 'center' };
    });
  
    // Create a Blob containing the Excel file
    const blob = await workbook.xlsx.writeBuffer();
  
    // Create a download link
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      link.setAttribute('href', url);
      link.setAttribute('download', 'customer_data.xlsx');
  
      // Append the link to the document and trigger a click event to start the download
      document.body.appendChild(link);
      link.click();
  
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      console.error('Export not supported in this browser.');
    }
  };
  
  
  
  

  return (
    <div>
      <button className='export-data-btn' onClick={exportData}  onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#0d2136";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#3f51b5";
        }}>Export to Excel</button>
      {/* ... rest of your component */}
    </div>
  );
};

export default ExportData;

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { db } from "../shared/firebase";
import './customerBarChart.css';



const CustomerBarChart = () => {
  const [customerCountData, setCustomerCountData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());


  
  const fetchCustomerData = async (year) => {
    try {
      const snapshot = await db.collection("customers").get();
      const customers = snapshot.docs.map((doc) => doc.data());

      // Aggregate customer count per unique month for the specified year
      const customerCountPerMonth = customers.reduce((countMap, customer) => {
        const startDate = new Date(customer.startDate); // Assuming startDate is a valid date
        const customerYear = startDate.getFullYear();

        if (customerYear === year) {
          const month = startDate.getMonth() + 1; // Month is zero-based, so add 1
          const monthKey = `${year}-${month}`; // Unique key for each month

          countMap[monthKey] = (countMap[monthKey] || 0) + 1;
        }

        return countMap;
      }, {});

      // Generate an array of the last 12 months for the specified year
      const last12Months = Array.from({ length: 12 }, (_, index) => {
        const monthDate = new Date(year, 11 - index, 1); // Start from December and go back
        return `${year}-${monthDate.getMonth() + 1}`;
      });

      // Reverse the order to display January on the left side
      const reversedMonths = last12Months.reverse();

      // Convert the count map to an array of objects with default months
      const customerCountArray = reversedMonths.map((monthKey) => ({
        Startday: monthKey, // Match the format used in the x-axis data
        "Customer Count": customerCountPerMonth[monthKey] || 0,
      }));

      setCustomerCountData(customerCountArray);
      setLoading(false); // Set loading to false after data is fetched
      console.log("Customers fetched successfully");
    } catch (error) {
      console.error("Error fetching customer data:", error.message);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  useEffect(() => {
    fetchCustomerData(currentYear);
  }, [currentYear]);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div style={{ overflowX: "auto", textAlign: "center", }}>
      {loading ? (
        <p>Loading...</p>
      ) : customerCountData.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <div className="graph">

          <BarChart
            width={1000}
            height={400}
            data={customerCountData}
            margin={{ top: 20, right: 40, left: 20, bottom: 5 }}
          >
            <CartesianGrid stroke="#ccc" strokeDasharray="1 1" />
            <XAxis
              dataKey="Startday"
              interval={0}
              tick={{ angle: 0, textAnchor: "middle", fontSize: 12 }}
              tickFormatter={(value) => {
                const [year, month] = value.split("-");
                return `${monthNames[parseInt(month) - 1]} ${year}`;
              }} // Format ticks to month names and year
            />
            <YAxis type="number" domain={[0, "dataMax + 5"]} interval={0} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#162c46",
                color: "#fff",
                borderRadius: "10px",
              }}
            />
            <Legend />
            <Bar dataKey="Customer Count" fill="orange" barSize={20} >
              <LabelList
                dataKey="Customer Count"
                position="top"
                style={{ fontSize: 12, fill: "#16FF00",}}
              />
            </Bar>
          </BarChart>
          <div>
          <button
              className="material-icons previous-btn"
              onClick={() => setCurrentYear((prevYear) => prevYear - 1)}
            >
              navigate_before
            </button>
            <button
              className="material-icons next-btn"
              onClick={() => setCurrentYear((prevYear) => prevYear + 1)}
            >
              navigate_next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerBarChart;

// YourComponent.js
import React, { useEffect, useState } from 'react';
import { firestore } from './firebase'; // Update the path accordingly

const CustomerCount = () => {
  const [inProgressCount, setInProgressCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionRef = firestore.collection('customers');
        const snapshot = await collectionRef.get();

        // Initialize counts
        let inProgress = 0;
        let completed = 0;

        snapshot.docs.forEach((doc) => {
          const status = doc.data().status;

          // Count occurrences of each status
          if (status === 'In Progress') {
            inProgress++;
          } else if (status === 'Completed') {
            completed++;
          }
        });

        // Set state with the counts
        setInProgressCount(inProgress);
        setCompletedCount(completed);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Your Component</h1>
      <p>Number of customers in progress: {inProgressCount}</p>
      <p>Number of completed customers: {completedCount}</p>
    </div>
  );
};

export default YourComponent;

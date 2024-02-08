// Import Firebase and necessary modules for Firestore and authentication
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

// Firebase configuration containing API keys and project details
const firebaseConfig = {
  apiKey: "AIzaSyCDhCPHzl6GcfFRSOIGxm6fJOGb1FbSEHw",
  authDomain: "clinic-dashboard-dbfda.firebaseapp.com",
  projectId: "clinic-dashboard-dbfda",
  storageBucket: "clinic-dashboard-dbfda.appspot.com",
  messagingSenderId: "576881402882",
  appId: "1:576881402882:web:e142539bb37b85d7bef31b",
  measurementId: "G-BJ6B50021D"
};

// Initialize Firebase with the provided configuration
firebase.initializeApp(firebaseConfig);

// Access Firestore and authentication services from Firebase
const firestore = firebase.firestore();
const auth = firebase.auth();

// Set up persistent authentication state
const onAuthStateChangedCallbacks = [];
let currentUser = null;

// Listen for changes in the authentication state and update the currentUser variable
auth.onAuthStateChanged((user) => {
  currentUser = user;
  // Notify all registered callbacks about the updated authentication state
  onAuthStateChangedCallbacks.forEach((callback) => callback(user));
});

// Function to get the current authenticated user
const getCurrentUser = () => currentUser;

// Function to register callbacks for changes in authentication state
const onAuthStateChanged = (callback) => {
  // Add the callback to the list of callbacks and immediately invoke it with the current user
  onAuthStateChangedCallbacks.push(callback);
  callback(currentUser);
};

// Access Firestore database separately
const db = firebase.firestore();

// Export Firebase, Firestore, authentication, and related utility functions
export { firebase, db, firestore, auth, getCurrentUser, onAuthStateChanged };

// Import necessary dependencies from React and React Router
import React, { useState, useEffect } from 'react';
import { auth } from '../shared/firebase'; // Adjust the path based on your project structure
import { useHistory } from 'react-router-dom';

// Import LoadingSpinner component for displaying a loading indicator
import LoadingSpinner from '../shared/LoadingSpinner';

// Functional component for the Login page
const Login = () => {
  // State variables for email, password, loading indicator, and useHistory hook
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // useEffect hook to check if the user is already authenticated and redirect to dashboard
  useEffect(() => {
    // Redirect to dashboard if user is already authenticated
    if (auth.currentUser) {
      history.push('/dashboard');
    }
  }, [history]);

  // Event handler for handling user login
  const handleLogin = async () => {
    try {
      setLoading(true);
      // Sign in with email and password using Firebase authentication
      await auth.signInWithEmailAndPassword(email, password);
      // Redirect to the dashboard after successful login
      history.push('/dashboard');
      console.log('Login successful');
    } catch (error) {
      console.error('Error logging in:', error.message);
    } finally {
      // Set loading state to false after login attempt is completed
      setLoading(false);
    }
  };

  // JSX for rendering the Login component
  return (
    <div>
      <h2>Login</h2>
      <label>Email:</label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label>Password:</label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      {/* Display loading spinner if the login operation is in progress */}
      {loading && <LoadingSpinner />}
    </div>
  );
};

// Export the Login component as the default export for the module
export default Login;

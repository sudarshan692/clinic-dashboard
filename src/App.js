// Import necessary dependencies from React and React Router
import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider, useAuth } from '../src/components/shared/AuthProvider';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Modal from 'react-modal';

// Set the root element for the Modal component
Modal.setAppElement('#root');

// PrivateRoute component - restricts access to authenticated users
const PrivateRoute = ({ component: Component, ...rest }) => {
  // Access the authentication context using the useAuth hook
  const authContext = useAuth();
  // If still loading user information, return a loading indicator
  if (authContext.loading) {
    return null;
  }
  // Render the route based on user authentication status
  return (
    <Route
      {...rest}
      render={(props) =>
        authContext.currentUser ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

// PublicRoute component - controls access to routes based on user authentication
const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  // Access the authentication context using the useAuth hook
  const authContext = useAuth();
  // If still loading user information, return a loading indicator
  if (authContext.loading) {
    return null;
  }
  // Render the route based on user authentication status and restriction
  return (
    <Route
      {...rest}
      render={(props) =>
        authContext.currentUser && restricted ? (
          <Redirect to="/dashboard" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

// App component - the main component that sets up the application structure
const App = () => {
  return (
    // Wrap the entire application with the AuthProvider to manage authentication state
    <AuthProvider>
      {/* Set up the application's navigation using React Router */}
      <Router>
        <Switch>
          {/* Public route for the login page */}
          <PublicRoute path="/login" restricted component={Login} />

          {/* Private route for the dashboard, accessible only to authenticated users */}
          <PrivateRoute path="/dashboard" component={Dashboard} />

          {/* Redirect from the root path to the login page */}
          <Redirect from="/" to="/login" />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

// Export the App component as the default export for the module
export default App;

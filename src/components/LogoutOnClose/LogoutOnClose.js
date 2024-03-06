// LogoutOnClose.js

import { useEffect } from "react";
import { auth } from "../shared/firebase";

const LogoutOnClose = () => {
  useEffect(() => {
    const handleUnload = async () => {
      try {
        // Sign out the authenticated user using Firebase authentication
        await auth.signOut();
        console.log("Logout on tab close successful");
      } catch (error) {
        console.error("Error logging out on tab close:", error.message);
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return null;
};

export default LogoutOnClose;

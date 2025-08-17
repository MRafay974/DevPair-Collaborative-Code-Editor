// AuthRedirectRoute.jsx
import { Navigate } from "react-router-dom";

export default function AuthRedirectRoute({ children }) {
  const isLoggedIn = localStorage.getItem("token"); // or your auth logic

  // If user is logged in, go to home
  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  // Else show the landing page
  return children;
}

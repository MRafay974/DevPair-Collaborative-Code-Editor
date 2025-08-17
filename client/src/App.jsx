import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Room from "./pages/Room";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Profile from "./pages/Profile";
import AuthRedirectRoute from "./context/AuthRedirectRoute"


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public */}
            <Route
             path="/"
  element={
    <AuthRedirectRoute>
      <Landing />
    </AuthRedirectRoute>
  }
/>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />



            {/* Protected */}


            <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/room/:id"
              element={
                <ProtectedRoute>
                  <Room />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

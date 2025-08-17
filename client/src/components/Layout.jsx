import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const location = useLocation();
  
  // Check if current path is a room page (matches /room/:id pattern)
  const isRoomPage = location.pathname.startsWith('/room/');
  
  return (
    <div className="min-h-screen bg-base-200">
      {/* Only show navbar if not on a room page */}
      {!isRoomPage && <Navbar />}
      <main>{children}</main>
    </div>
  );
}
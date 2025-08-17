// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useRef, useState } from "react";

export default function Navbar() {
  const { user, logout, setUser } = useAuth(); // setUser used to update avatar in context
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAvatarClick = () => {
    if (!user) return navigate("/login");
    fileRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview (nice UX)
    const localUrl = URL.createObjectURL(file);
    setUser?.({ ...user, avatarUrl: localUrl });

    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("avatar", file);

      const token = localStorage.getItem("token");
      const res = await axios.post("https://dev-pair-backendd.vercel.app/api/auth/avatar", fd, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.avatarUrl) {
        setUser?.({ ...user, avatarUrl: res.data.avatarUrl });
        // Persist avatar for reloads (optional)
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, avatarUrl: res.data.avatarUrl }));
      }
    } catch (err) {
      // Fallback: store as base64 so it persists if backend isn’t ready
      try {
        const reader = new FileReader();
        reader.onload = () => {
          setUser?.({ ...user, avatarUrl: reader.result });
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({ ...stored, avatarUrl: reader.result }));
        };
        reader.readAsDataURL(file);
      } catch {}
    } finally {
      setUploading(false);
    }
  };

  // Render login/signup links ONLY when logged out
  const NavLinks = () => {
    if (user) return null;
    return (
      <>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
      </>
    );
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Left: Brand */}
      <div className="flex-1">
        { !user ?   <Link to="/" className="btn btn-ghost text-xl font-extrabold">
          <span className="text-primary">DevPair</span>
        </Link> :  <Link to="/home" className="btn btn-ghost text-xl font-extrabold">
          <span className="text-primary">DevPair</span>
        </Link>

        }
       

        {/* Mobile hamburger (shows only when logged out, since NavLinks hides when user exists) */}
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <NavLinks />
          </ul>
        </div>
      </div>

      {/* Right: Desktop links (only when logged out) + Profile (when logged in) */}
      <div className="flex-none gap-3 items-center">
        {/* Desktop auth links (hidden entirely when user is logged in) */}
        <ul className="menu menu-horizontal hidden lg:flex px-1">
          <NavLinks />
        </ul>

        {/* Profile block (only when logged in) */}
        {user && (
          <div className="dropdown dropdown-end">
            {/* Avatar + name (click avatar to upload) */}
            <button
              tabIndex={0}
              className="btn btn-ghost flex items-center gap-2"
              onClick={handleAvatarClick}
              title="Click to change avatar"
            >
              <div className="avatar">
                <div className="w-9 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2 overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="avatar" />
                  ) : (
                    <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center">
                      <span>{user?.username?.[0]?.toUpperCase() || "U"}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className="hidden md:inline text-sm font-medium">
                {uploading ? "Uploading…" : user.username}
              </span>
            </button>

            {/* Dropdown menu */}
            <ul tabIndex={0} className="menu dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-56 p-2 shadow">
              <li><Link to="/home">Dashboard</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>

            {/* Hidden file input for avatar uploads */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

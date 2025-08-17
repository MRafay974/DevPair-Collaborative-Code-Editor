import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  if (!user) return <div className="p-6">Please log in.</div>;

  const onAvatarPick = async (file) => {
    if (!file) return;
    // Preview
    const localUrl = URL.createObjectURL(file);
    setUser({ ...user, avatarUrl: localUrl });

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const fd = new FormData();
      fd.append("avatar", file);

      const res = await axios.post("http://localhost:5000/api/auth/avatar", fd, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.avatarUrl) {
        setUser({ ...user, avatarUrl: res.data.avatarUrl });
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, avatarUrl: res.data.avatarUrl }));
      }
    } catch (e) {
      // keep preview; store base64 fallback
      const reader = new FileReader();
      reader.onload = () => {
        setUser({ ...user, avatarUrl: reader.result });
        const stored = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem("user", JSON.stringify({ ...stored, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body flex gap-6 items-center">
          <div className="avatar">
            <div className="w-20 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" />
              ) : (
                <div className="bg-neutral text-neutral-content w-full h-full flex items-center justify-center text-2xl">
                  <span>{user?.username?.[0]?.toUpperCase() || "U"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="label"><span className="label-text">Username</span></div>
                <input className="input input-bordered w-full" value={user.username} readOnly />
              </div>
              <div>
                <div className="label"><span className="label-text">Email</span></div>
                <input className="input input-bordered w-full" value={user.email} readOnly />
              </div>
            </div>
            <div className="mt-4">
              <label className="btn">
                {uploading ? "Uploading…" : "Change Avatar"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onAvatarPick(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

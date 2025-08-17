import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function DevPairMark() {
  return (
    <svg viewBox="0 0 48 48" className="w-10 h-10" aria-label="DevPair">
      <defs>
        <linearGradient id="g2" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="22" fill="url(#g2)" opacity="0.15" />
      <path d="M18 15 L12 24 L18 33" stroke="url(#g2)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M30 15 L36 24 L30 33" stroke="url(#g2)" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setLoading(true);
    try {
      await axios.post("https://dev-pair-backendd.vercel.app/api/auth/register", form);
      const res = await axios.post("https://dev-pair-backendd.vercel.app/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      login({ token: res.data.token, user: res.data.user });
      navigate("/home", { replace: true });
    } catch (error) {
      setErr(error?.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-100">
      <div className="mx-auto max-w-md px-4 py-10">
        <div className="card bg-base-100 shadow-xl border border-base-300">
          <div className="card-body">
            <div className="mx-auto mb-2"><DevPairMark /></div>
            <h2 className="text-center text-2xl font-extrabold">Create your account</h2>
            <p className="text-center text-sm opacity-70 mb-4">
              Join DevPair and start collaborating in minutes.
            </p>

            {err && <div className="alert alert-error">{err}</div>}

            <form onSubmit={onSubmit} className="space-y-3">
              {/* Username */}
              <label className="form-control">
                <div className="label"><span className="label-text">Username</span></div>
                <input
                  className="input input-bordered w-full"
                  name="username"
                  placeholder="yourname"
                  value={form.username}
                  onChange={onChange}
                  required
                  autoComplete="username"
                />
              </label>

              {/* Email */}
              <label className="form-control">
                <div className="label"><span className="label-text">Email</span></div>
                <input
                  className="input input-bordered w-full"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  autoComplete="email"
                />
              </label>

              {/* Password (input-group keeps same height as Email) */}
              <label className="form-control">
                <div className="label"><span className="label-text">Password</span></div>
                <div className="input-group">
                  <input
                    className="input input-bordered w-full"
                    name="password"
                    type={showPw ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={form.password}
                    onChange={onChange}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setShowPw((s) => !s)}
                  >
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="label">
                  <span className="label-text-alt opacity-70">
                    Use a strong password you don’t reuse elsewhere.
                  </span>
                </div>
              </label>

              <button type="submit" className="btn btn-primary w-full mt-2" disabled={loading}>
                {loading ? "Creating…" : "Sign up"}
              </button>
            </form>

            <div className="divider my-5">or</div>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">Log in</Link>
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs opacity-60">
          By creating an account, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

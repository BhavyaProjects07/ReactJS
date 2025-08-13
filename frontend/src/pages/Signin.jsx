// src/pages/Signin.jsx
import { act, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Add this

export default function Signin({ onAuthSuccess }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSignin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please provide email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}api/auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signin",
          email, password
        }),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (res.ok) {
        // Expecting returned username or token with username
        const username = (data && data.username) || data?.user?.username || null;
        if (username) {
          localStorage.setItem("username", username);
          onAuthSuccess?.(username);
          navigate("/");
        } else {
          // if backend returns token instead, you might decode it here or request profile
          onAuthSuccess?.(null);
        }
      } else {
        let msg = "Sign in failed.";
        if (data && (data.error || data.message)) msg = data.error || data.message;
        else msg = text;
        setError(msg);
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900/60 p-6 rounded-2xl border border-gray-800">
      <form onSubmit={handleSignin} className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Sign in</h2>
        <p className="text-sm text-gray-300">Sign in with your registered email & password.</p>

        <div>
          <label className="text-xs text-gray-300">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            placeholder="you@example.com"
            required
            type="email"
          />
        </div>

        <div>
          <label className="text-xs text-gray-300">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
            placeholder="Your password"
            required
            type="password"
          />
          <Link to="/signup" className="text-sm text-blue-400 hover:underline mt-2">
            <p>Signup here</p>
          </Link>
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

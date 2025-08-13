// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function Signup({ onAuthSuccess }) {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const [step, setStep] = useState("form"); // form | otp | done
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!username.trim() || !email.trim() || !password) {
      setError("Please fill all fields.");
      return false;
    }
    // basic email check
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError(null);
    setInfo(null);

    try {
      const res = await fetch(`${BASE_URL}api/auth/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signup",
          username, email, password
        }),
      });

      if (res.ok) {
        setInfo("OTP has been sent to your email. Enter it below to verify.");
        setStep("otp");
      } else {
        const text = await res.text();
        let msg = "Signup failed.";
        try {
          const json = JSON.parse(text);
          msg = json.error || json.message || JSON.stringify(json);
        } catch {
          msg = text;
        }
        setError(msg);
      }
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}api/auth/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "verify",
          email, otp
        }),
      });

      if (res.ok) {
        // success — set username locally and notify parent
        localStorage.setItem("username", username);
        onAuthSuccess?.(username);
        navigate("/");
        window.location.reload(); // reload to update UI
        // or you can set a success state and show a message instead  
        //
        setStep("done");
      } else {
        const text = await res.text();
        let msg = "OTP verification failed.";
        try {
          const json = JSON.parse(text);
          msg = json.error || json.message || JSON.stringify(json);
        } catch {
          msg = text;
        }
        setError(msg);
      }
    } catch (err) {
      setError("Network error during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900/60 p-6 rounded-2xl border border-gray-800">
      {step === "form" && (
        <form onSubmit={handleSignup} className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Create account</h2>
          <p className="text-sm text-gray-300">Sign up with username, email & password.</p>

          <div>
            <label className="text-xs text-gray-300">Username</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="cool_username"
              required
            />
          </div>

          <div>
            <label className="text-xs text-gray-300">Email</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              type="email"
            />
          </div>

          <div>
            <label className="text-xs text-gray-300">Password</label>
            <input
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              type="password"
            />
            <Link to="/signin" className="text-sm text-blue-400 hover:underline mt-2">
              <p>Signin here</p>
            </Link>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}
          {info && <div className="text-sm text-emerald-300">{info}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Sending OTP..." : "Sign up & Send OTP"}
          </button>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={handleVerify} className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Enter verification code</h3>
          <p className="text-sm text-gray-300">We sent an email to <span className="font-medium">{email}</span></p>

          <div>
            <label className="text-xs text-gray-300">OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              placeholder="123456"
            />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-full bg-emerald-600 text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify & Finish"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("form");
                setOtp("");
                setError(null);
                setInfo(null);
              }}
              className="px-4 py-2 rounded-full border border-gray-700 text-gray-200"
            >
              Edit details
            </button>
          </div>
        </form>
      )}

      {step === "done" && (
        <div className="text-center py-6">
          <h3 className="text-2xl font-bold text-white">Welcome, {username} 🎉</h3>
          <p className="text-sm text-gray-300">Your email is verified and you're signed in.</p>
        </div>
      )}
    </div>
  );
}

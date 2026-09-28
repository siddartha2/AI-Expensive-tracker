import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";

function Login() {
  console.log("Login: Component rendering");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      alert("Login successful");

      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Cannot reach server. Run the backend on port 5000.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="auth-heading">Welcome back</h1>
      <p className="auth-subtitle">Sign in to continue managing your finances.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-label" htmlFor="login-email">Email address</label>
          <input
            id="login-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="auth-input"
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="auth-input has-toggle"
              onChange={handleChange}
            />
            <button
              type="button"
              className="auth-password-toggle"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>
        </div>

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting && <FaSpinner className="auth-spinner" aria-hidden="true" />}
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-form-footer">
        Don&apos;t have an account?
        <Link to="/signup" className="auth-footer-link">Sign up</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post("/auth/signup", formData);

      alert("Signup successful");

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Cannot reach server. Run the backend on port 5000.";
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordStrength = Math.min(
    4,
    Number(formData.password.length >= 8) +
      Number(formData.password.length >= 12) +
      Number(/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password)) +
      Number(/[0-9]/.test(formData.password) || /[^A-Za-z0-9]/.test(formData.password)),
  );
  const strengthLabel = ["", "Low", "Fair", "Good", "Strong"][passwordStrength];

  return (
    <AuthLayout>
      <h1 className="auth-heading">Create your account</h1>
      <p className="auth-subtitle">Start building better financial habits today.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-name">Full name</label>
          <input
            id="signup-name"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Your name"
            className="auth-input"
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-email">Email address</label>
          <input
            id="signup-email"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="auth-input"
            onChange={handleChange}
          />
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-password">Password</label>
          <div className="auth-input-wrap">
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              name="password"
              autoComplete="new-password"
              placeholder="Create a password"
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
          {formData.password && (
            <div className="auth-strength" aria-label={`Password strength: ${strengthLabel}`}>
              <div className="auth-strength-bars" aria-hidden="true">
                {[1, 2, 3, 4].map((level) => (
                  <span key={level} className={level <= passwordStrength ? "active" : ""} />
                ))}
              </div>
              <span className="auth-strength-label">{strengthLabel}</span>
            </div>
          )}
        </div>

        <div className="auth-field">
          <label className="auth-label" htmlFor="signup-confirm-password">Confirm password</label>
          <div className="auth-input-wrap">
            <input
              id="signup-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              className="auth-input has-toggle"
              onChange={handleChange}
            />
            <button
              type="button"
              className="auth-password-toggle"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((visible) => !visible)}
            >
              {showConfirmPassword ? <FaEyeSlash aria-hidden="true" /> : <FaEye aria-hidden="true" />}
            </button>
          </div>
        </div>

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting && <FaSpinner className="auth-spinner" aria-hidden="true" />}
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="auth-form-footer">
        Already have an account?
        <Link to="/" className="auth-footer-link">Sign in</Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;
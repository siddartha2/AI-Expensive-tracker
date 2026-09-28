import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

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

    try {
      await API.post("/auth/signup", formData);

      alert("Signup successful");

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Cannot reach server. Run the backend on port 5000.";
      alert(message);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg w-96"
      >
        <h1 className="text-white text-3xl mb-6 text-center">
          Signup
        </h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          className="w-full p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 rounded"
          onChange={handleChange}
        />

        <button className="w-full bg-blue-500 text-white p-3 rounded">
          Signup
        </button>

        <p className="text-gray-400 text-center mt-4">
          Already have an account? <Link to="/" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
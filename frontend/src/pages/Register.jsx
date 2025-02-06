import { useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    is_professional: false,
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://project-phase-4-1.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Allows session cookies if needed
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        let errorMessage = "Registration failed";
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (error) {
          console.error("Error parsing response:", error);
        }
        throw new Error(errorMessage);
      }

      toast.success("Registration successful! Please login.");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-2xl">Register</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          className="border p-2 w-full"
          type="text"
          placeholder="Full Name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.is_professional}
            onChange={(e) => setFormData({ ...formData, is_professional: e.target.checked })}
          />
          <span className="ml-2">Register as a professional</span>
        </label>
        <button className="bg-blue-500 text-white p-2 rounded w-full" type="submit">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;

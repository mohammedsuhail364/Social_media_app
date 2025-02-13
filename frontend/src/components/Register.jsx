import { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/register", formData);
      alert("Signup successful! Please log in.");
      localStorage.setItem("token", "successfully sign in");
      navigate("/feed");
    } catch (error) {
      console.log(error);

      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Typography variant="h5" className="mb-6 text-center text-gray-800">
          Sign Up
        </Typography>
        <TextField
          name="username"
          label="Username"
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="email"
          label="Email"
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField
          name="password"
          label="Password"
          type="password"
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <div className="mt-4">
          <Button
            variant="contained"
            fullWidth
            className="mt-4 bg-green-600 text-white hover:bg-green-700"
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
        </div>
        <div className="mt-4">
          <Typography className="mt-4 text-center">
            Already have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Signup;

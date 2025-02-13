import {  useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents page refresh
    try {
      await axios.post("http://localhost:5000/api/users/login", formData);
      localStorage.setItem("token", "successfully logged in");
      alert("Login successful!");
      navigate("/feed"); // Navigate to the feed page
    } catch (error) {
      console.log(error);
      alert("Login failed. Please check your credentials.");
    }
  };

  // useEffect(() => {
  //   const isAuthenticated = localStorage.getItem("token");
  //   if (isAuthenticated) {
  //     navigate('/feed');
  //   }
  // }, []); // Ensure navigate is only triggered when necessary

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Typography variant="h5" className="mb-6 text-center text-gray-800">
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="email"
            label="Email"
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            autoComplete="suhail"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
            autoComplete="current-password" // Add this line
          />
          <div className="mt-4">

          <Button
            variant="contained"
            fullWidth
            className=" bg-blue-600 text-white hover:bg-blue-700"
            type="submit" // changed to submit type
          >
            Login
          </Button>
          </div>
        </form>
        <div className="mt-5">
          <Typography className="text-center">
            Don{"'"}t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { Container } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Feed from "./components/Feed";
import Login from "./components/Login";
import Register from "./components/Register";
const App = () => {
  const isAuthenticated = localStorage.getItem("token");
  

  return (
    <Router>
      <Container maxWidth="md">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Register />} />
          <Route
            path="/feed"
            element={isAuthenticated ? <Feed /> : <Navigate to="/" />}
          />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

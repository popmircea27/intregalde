import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navBar/NavBar";
import DashBord from "./admin/dashbord/DashBord";
import LoginPage from "./admin/login/LoginPage";

function App() {
  return (
    <Router>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashBord />} />

      </Routes>
    </Router>
  );
}

export default App;

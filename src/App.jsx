import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashBord from "./admin/dashbord/DashBord";
import LoginPage from "./admin/login/LoginPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard protejat */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute requiredRole="ADMIN">
              <DashBord />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

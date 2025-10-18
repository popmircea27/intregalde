import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DashBord from "./admin/dashbord/DashBord";
import LoginPage from "./admin/login/LoginPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* login doar pentru utilizatori nelogați */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* dashboard doar pentru admin */}
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

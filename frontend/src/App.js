import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import  jwtDecode  from 'jwt-decode';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Components/Dashboard";
import AddMember from "./Components/AddMember";
import UpdateOrDeleteMembers from "./Components/UpdateOrDeleteMember";
import CreateBills from "./Components/CreateBills";
import AssignNotification from "./Components/AssignNotification";
import FeePackages from "./Components/FeePackages";
import SupplementStore from "./Components/SupplementStore";
import ReportExport from "./Components/ReportExport";
import DietDetails from "./Components/DietDetails";
import LoginPage from "./Components/LoginPage";
import NotFound from "./Components/NotFound";
import MemberDashboard from "./Components/MemberDashboard";
import MemberFeePackages from "./Components/MemberFeePackages";
import MemberSupplementStore from "./Components/MemberSupplementStore";
import MemberDietDetails from "./Components/MemberDietDetails";
import ProtectedRoute from "./Components/ProtectedRoute";

import "./App.css";

const App = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("jwt_token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.error("Invalid token:", err);
        setRole(null);
      }
    } else {
      setRole(null);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage setRole={setRole} />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path="/dashboard"
            element={role === "admin" ? <Dashboard /> : <MemberDashboard />}
          />
          <Route
            path="/notifications"
            element={role === "admin" ? <AssignNotification /> : <NotFound />}
          />
          <Route
            path="/add-member"
            element={role === "admin" ? <AddMember /> : <NotFound />}
          />
          <Route
            path="/update-members"
            element={role === "admin" ? <UpdateOrDeleteMembers /> : <NotFound />}
          />
          <Route
            path="/create-bills"
            element={role === "admin" ? <CreateBills /> : <NotFound />}
          />
          <Route
            path="/fee-packages"
            element={role === "admin" ? <FeePackages /> : <MemberFeePackages />}
          />
          <Route
            path="/supplements"
            element={role === "admin" ? <SupplementStore /> : <MemberSupplementStore />}
          />
          <Route
            path="/reports"
            element={role === "admin" ? <ReportExport /> : <NotFound />}
          />
          <Route
            path="/diet-details"
            element={role === "admin" ? <DietDetails /> : <MemberDietDetails />}
          />
        </Route>

        {/* Redirect any unknown route to /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

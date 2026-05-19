import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "../src/core/auth/ProtectedRoute";
import Register from "./core/auth/register";

import HomeRoutes from "./modules/home/homeRoutes";
import UserRouters from "./modules/user/userRouters";

export const Roles = {
  Administrator: 1,
  Ui_designer: 2,
  User: 3,
  Guest: 4,
};

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/public/register" element={<Register />} />

      <Route path="/public/home/*" element={<HomeRoutes />} />

      <Route
        path="/public/user/*"
        element={
          <ProtectedRoute allowedRoles={[Roles.User]}>
            <UserRouters />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/public/home" replace />} />
    </Routes>
  );
}

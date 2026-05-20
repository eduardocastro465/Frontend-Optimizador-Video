import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
  allowedRoles?: number[];
}

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user } = useAuth();

  console.log(user);

  // No hay sesión → manda al login
  if (!user) return <Navigate to="/public/home" replace />;

  // Hay sesión pero el role no está permitido → manda al inicio
  if (allowedRoles && !allowedRoles.includes(user.role_id)) {
    return <Navigate to="/public/home" replace />;
  }

  return <>{children}</>;
}

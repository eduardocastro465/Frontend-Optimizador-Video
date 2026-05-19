import { AppProvider } from "./core/contexts/AppContext";
import { AuthProvider } from "./core/contexts/AuthContext";
import AppRouter from "./AppRouter";

export default function App() {
  return (
    <AppProvider>
      {" "}
      {/* ← contexto global (tema, idioma, etc.) */}
      <AuthProvider>
        {" "}
        {/* ← sesión, user, role */}
        <AppRouter /> {/* ← aquí empiezan las rutas */}
      </AuthProvider>
    </AppProvider>
  );
}

import { createContext, useContext, useState } from "react";
import type { AppContextType } from "../types/app.types";

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [cargando, setCargando] = useState(false);

  const toggleSidebar = () => setSidebarAbierto((prev) => !prev);

  return (
    <AppContext.Provider
      value={{ sidebarAbierto, toggleSidebar, cargando, setCargando }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
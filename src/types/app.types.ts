export interface AppContextType {
  sidebarAbierto: boolean;
  toggleSidebar: () => void;
  cargando: boolean;
  setCargando: (v: boolean) => void;
}

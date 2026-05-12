export interface Notificacion {
  id: string;
  mensaje: string;
  leida: boolean;
  fecha: string;
}

export interface NotifContextType {
  notificaciones: Notificacion[];
  noLeidas: number;
  agregarNotif: (notif: Notificacion) => void;
  marcarLeida: (id: string) => void;
  limpiarTodas: () => void;
}

import { createContext, useContext, useState } from 'react';

import type { Notificacion, NotifContextType } from '../types/notif.types';

const NotifContext  = createContext<NotifContextType | null>(null);

export function NotifProvider({ children }: { children: React.ReactNode }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const noLeidas = notificaciones.filter(n => !n.leida).length;

  const agregarNotif = (notif: Notificacion) => {
    setNotificaciones(prev => [notif, ...prev]);
  };

  const marcarLeida = (id: string) => {
    setNotificaciones(prev =>
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  };

  const limpiarTodas = () => setNotificaciones([]);

  return (
    <NotifContext.Provider value={{ notificaciones, noLeidas, agregarNotif, marcarLeida, limpiarTodas }}>
      {children}
    </NotifContext.Provider>
  );
}

export function useNotificaciones() {
  const ctx = useContext(NotifContext);
  if (!ctx) throw new Error('useNotificaciones debe usarse dentro de NotifContext');
  return ctx;
}
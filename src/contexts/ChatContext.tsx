import { createContext, useContext, useState } from 'react';

import type { Mensaje, Conversacion, ChatContextType } from '../types/chat.types';

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversaciones, setConversaciones] = useState<Conversacion[]>([]);
  const [conversacionActiva, setConversacionActiva] = useState<string | null>(null);

  const agregarMensaje = (convId: string, mensaje: Mensaje) => {
    setConversaciones(prev =>
      prev.map(c =>
        c.id === convId
          ? { ...c, mensajes: [...c.mensajes, mensaje] }
          : c
      )
    );
  };

  return (
    <ChatContext.Provider value={{ conversaciones, conversacionActiva, setConversacionActiva, agregarMensaje }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat debe usarse dentro de ChatContext');
  return ctx;
}
export interface Mensaje {
  id: string;
  texto: string;
  autorId: string;
  fecha: string;
}

export interface Conversacion {
  id: string;
  contactoId: string;
  mensajes: Mensaje[];
}

export interface ChatContextType {
  conversaciones: Conversacion[];
  conversacionActiva: string | null;
  setConversacionActiva: (id: string) => void;
  agregarMensaje: (convId: string, mensaje: Mensaje) => void;
}

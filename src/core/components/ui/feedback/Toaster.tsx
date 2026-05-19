import { useEffect, useState } from "react";
import type { ToastType } from "../../../hooks/useToast";

interface ToastItemProps {
  id: number;
  message: string;
  type: ToastType;
  onRemove: (id: number) => void;
}

const config = {
  success: {
    icon: "ti-circle-check",
    color: "text-emerald-400",
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    bar: "bg-emerald-400",
  },
  error: {
    icon: "ti-alert-circle",
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/10",
    bar: "bg-red-400",
  },
  info: {
    icon: "ti-info-circle",
    color: "text-violet-400",
    border: "border-violet-500/20",
    bg: "bg-violet-500/10",
    bar: "bg-violet-400",
  },
};

function ToastItem({ id, message, type, onRemove }: ToastItemProps) {
  const [visible, setVisible] = useState(false);
  const c = config[type];

  useEffect(() => {
    // Entrada
    const show = setTimeout(() => setVisible(true), 10);
    // Salida
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(id), 300);
    }, 3700);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  return (
    <div
      className={`
        relative flex items-center gap-3 px-4 py-3 rounded-xl
        border ${c.border} ${c.bg}
        backdrop-blur-md shadow-lg shadow-black/30
        transition-all duration-300 ease-out overflow-hidden
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      {/* Icono */}
      <i className={`ti ${c.icon} ${c.color} text-base flex-shrink-0`} />

      {/* Mensaje */}
      <p className="font-ui text-[13px] text-white/80 flex-1">{message}</p>

      {/* Cerrar */}
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(() => onRemove(id), 300);
        }}
        className="text-white/20 hover:text-white/50 transition-colors ml-1"
      >
        <i className="ti ti-x text-sm" />
      </button>

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <div
          className={`h-full ${c.bar} opacity-50`}
          style={{
            animation: "shrink 4s linear forwards",
          }}
        />
      </div>

      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

interface ToasterProps {
  toasts: { id: number; message: string; type: ToastType }[];
  onRemove: (id: number) => void;
}

export default function Toaster({ toasts, onRemove }: ToasterProps) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 w-80  z-[9999]">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} onRemove={onRemove} />
      ))}
    </div>
  );
}

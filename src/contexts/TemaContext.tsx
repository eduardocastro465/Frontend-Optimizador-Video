import { createContext, useContext, useState, useEffect } from "react";
import type { Tema, TemaContextType } from "../types/tema.types";

const TemaContext = createContext<TemaContextType | null>(null);

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>(() => {
    const saved = localStorage.getItem("tema");
    return saved === "claro" || saved === "oscuro" ? saved : "claro";
  });

  useEffect(() => {
    document.body.setAttribute("data-tema", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  const toggleTema = () =>
    setTema((prev) => (prev === "claro" ? "oscuro" : "claro"));

  return (
    <TemaContext.Provider value={{ tema, toggleTema }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error("useTema debe usarse dentro de TemaProvider");
  return ctx;
}

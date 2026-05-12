export type Tema = 'claro' | 'oscuro';

export interface TemaContextType {
  tema: Tema;
  toggleTema: () => void;
}

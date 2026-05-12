export interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
  fecha_creacion: Date;
  fecha_vencimiento?: Date;
  prioridad: 'baja' | 'media' | 'alta';
  usuario_id: number;
}

export interface CrearTareaDTO {
  titulo: string;
  descripcion: string;
  fecha_vencimiento?: Date;
  prioridad: 'baja' | 'media' | 'alta';
}

export interface ActualizarTareaDTO extends Partial<CrearTareaDTO> {
  completada?: boolean;
}

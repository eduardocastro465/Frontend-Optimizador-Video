import { HTTP_ERRORS } from './httpErrors'

export { AUTH_ERRORS } from './authErrors'
export { HTTP_ERRORS } from './httpErrors'

// Función helper que combina ambos
export function getErrorMessage(status: number, specific: Record<number, string>): string {
  return specific[status] ?? HTTP_ERRORS[status] ?? "Ocurrió un error inesperado"
}
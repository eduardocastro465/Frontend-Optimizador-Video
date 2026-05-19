import z from "zod";

export const userSchema = z
  .object({
    username: z
      .string({ error: "Nombre de usuario inválido" })
      .min(1, "El nombre de usuario es obligatorio")
      .min(3, "Mínimo 3 caracteres")
      .max(30, "Máximo 30 caracteres")
      .regex(/^[a-zA-Z0-9_]+$/, "Solo se permiten letras, números y guiones bajos"),

    email: z.email({ error: "Correo electronico inválido" }).max(254).min(3),

    password: z
      .string({ error: "La contraseña es obligatoria" })
      .min(1, "La contraseña es obligatoria")
      .min(8, "Mínimo 8 caracteres")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^a-zA-Z0-9]/, "Debe contener al menos un carácter especial"),

    confirmPassword: z
      .string({ error: "La confirmación es obligatoria" })
      .min(1, "Confirma tu contraseña")
      .min(8, "Mínimo 8 caracteres"),

  })

  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"], // campo donde mostrará el error
  });

export const perfilUserSchema = z.object({
  firstName: z
    .string({ error: "Nombre inválido" })
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres"),

  lastName: z
    .string({ error: "Apellido inválido" })
    .min(3, "Mínimo 3 caracteres")
    .max(50, "Máximo 50 caracteres"),

  phone: z
    .string({ error: "El teléfono es obligatorio" })
    .min(1, "El teléfono es obligatorio")
    .regex(/^[0-9]{8,20}$/, "El teléfono debe tener entre 8 y 20 dígitos")
    .optional(),

  birthDate: z
    .string({ error: "La fecha de nacimiento es obligatoria" })
    .min(1, "La fecha de nacimiento es obligatoria")
    .refine((fecha) => !isNaN(Date.parse(fecha)), "Fecha inválida")
    .refine((fecha) => {
      const date = new Date(fecha);
      const today = new Date();
      return date < today;
    }, "La fecha no puede ser futura"),

  country: z
    .string({ error: "País inválido" })
    .min(1, "El Apellido es obligatorio")
    .max(60, "Máximo 60 caracteres")
    .optional(),
});

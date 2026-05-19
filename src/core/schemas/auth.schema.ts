import { z } from "zod";
import { perfilUserSchema, userSchema } from "./user.schema";

export const usernameSchema = z
  .string({ error: "nombre de usuario invalido" })
  .min(3, "Mínimo 3 caracteres")
  .max(20, "Máximo 20 caracteres")
  .regex(/^[a-zA-Z0-9_]+$/, "Solo letras, números y guion bajo");

export const emailSchema = z
  .email("Correo electrónico inválido")
  .max(254)
  .min(3);

export const loginSchema = z.object({
  identifier: z.string().superRefine((val, ctx) => {
    if (val.includes("@")) {
      const result = emailSchema.safeParse(val);
      if (!result.success) {
        ctx.addIssue({
          code: "custom",
          message: "Correo electrónico inválido",
        });
      }
    } else {
      const result = usernameSchema.safeParse(val);
      if (!result.success) {
        ctx.addIssue({
          code: "custom",
          message: result.error.issues[0].message,
        });
      }
    }
  }),
  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe contener al menos un símbolo"),
});

export const registerSchema = z.object({
  user: userSchema,
  perfilUser: perfilUserSchema,
});

export type registerForm = z.infer<typeof registerSchema>;

export type LoginForm = z.infer<typeof loginSchema>; // Se usa para tipar los datos que se reciben del formulario

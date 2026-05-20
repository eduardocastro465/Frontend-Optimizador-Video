import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ShieldIcon,
  LockIcon,
  MailIcon,
  FacebookIcon,
  GoogleIcon,
  EyeOpen,
  EyeClosed,
} from "../../assets";

import { useToast } from "../hooks/useToast";
import Toaster from "../components/ui/feedback/Toaster";
import Input from "../components/ui/inputs/Input";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import SocialButton from "../components/ui/buttons/SocialButton";
import Header from "../layout/Header";
import Stepper, { type StepConfig } from "../components/ui/display/Stepper";
import OtpInput from "../components/ui/display/OtpInput";

import { useAuth } from "../hooks/useAuth.ts";
import { registerSchema, type registerForm } from "../schemas/auth.schema.ts";
import DatePicker from "../components/ui/display/Datepicker.tsx";
import {
  enviarCodigoEmail,
  validarUsername,
} from "../services/auth.services.ts";

// ─── Pasos del stepper ────────────────────────────────────────────────────────

const STEPS: StepConfig[] = [
  {
    label: "Tu info",
    icon: <i className="ti ti-user text-sm" aria-hidden="true" />,
  },
  {
    label: "Verificar",
    icon: <i className="ti ti-mail text-sm" aria-hidden="true" />,
  },
  {
    label: "Perfil",
    icon: <i className="ti ti-id text-sm" aria-hidden="true" />,
  },
  {
    label: "Seguridad",
    icon: <i className="ti ti-lock text-sm" aria-hidden="true" />,
  },
  {
    label: "Confirmar",
    icon: <i className="ti ti-check text-sm" aria-hidden="true" />,
  },
];

// ─── Password strength ────────────────────────────────────────────────────────

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map = [
    { label: "", color: "bg-white/10" },
    { label: "Débil", color: "bg-red-400/70" },
    { label: "Regular", color: "bg-amber-400/70" },
    { label: "Buena", color: "bg-emerald-400/60" },
    { label: "Fuerte", color: "bg-violet-400/90" },
  ] as const;

  return { score, ...map[score] };
}

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { score, label } = getStrength(password);

  // ── Criterios: qué falta ──────────────────────────────────────────────────
  const criteria = [
    { test: password.length >= 8, missing: "mín. 8 caracteres" },
    { test: /[A-Z]/.test(password), missing: "una mayúscula" },
    { test: /[0-9]/.test(password), missing: "un número" },
    { test: /[^A-Za-z0-9]/.test(password), missing: "un símbolo" },
  ];

  const missing = criteria.filter((c) => !c.test).map((c) => c.missing);

  // ── Visual por nivel ──────────────────────────────────────────────────────
  const levels = [
    {
      icon: "ti-shield-off",
      iconColor: "text-red-400",
      barFill: "bg-red-500",
      labelColor: "text-red-400",
    },
    {
      icon: "ti-shield-half",
      iconColor: "text-amber-400",
      barFill: "bg-amber-400",
      labelColor: "text-amber-400",
    },
    {
      icon: "ti-shield-check",
      iconColor: "text-emerald-400",
      barFill: "bg-emerald-400",
      labelColor: "text-emerald-400",
    },
    {
      icon: "ti-shield-lock",
      iconColor: "text-violet-400",
      barFill: "bg-violet-500",
      labelColor: "text-violet-400",
    },
  ] as const;

  const lvl = levels[Math.max(0, Math.min(score - 1, levels.length - 1))];

  return (
    <div className="mt-2 mb-2.5 px-0.5">
      {/* Barras */}
      <div className="flex gap-1.5 mb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative h-1.5 flex-1 rounded-full overflow-hidden bg-white/[0.06]"
          >
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
                i <= score ? lvl.barFill : ""
              }`}
              style={{
                width: i <= score ? "100%" : "0%",
                transitionDelay: i <= score ? `${(i - 1) * 60}ms` : "0ms",
              }}
            />
          </div>
        ))}
      </div>

      {/* Ícono + label */}
      <div className="flex items-center gap-1.5 mb-1">
        <i
          className={`ti ${lvl.icon} text-[13px] ${lvl.iconColor} transition-all duration-300`}
          aria-hidden="true"
        />
        <span className={`font-ui text-[11px] ${lvl.labelColor}`}>{label}</span>
      </div>

      {/* Qué falta — solo si hay criterios pendientes */}
      {missing.length > 0 && (
        <p className="font-ui text-caption text-red-400 mt-1.5 min-h-[8px]">
          Falta: {missing.join(", ")}
        </p>
      )}
    </div>
  );
}
// ─── Botón ghost de "Atrás" ───────────────────────────────────────────────────

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex-none px-4 py-2.5 rounded-lg border border-white/[0.12] text-white/40
                 hover:text-white/60 hover:border-white/[0.22] text-sm transition-all duration-150"
      aria-label="Regresar"
    >
      <i className="ti ti-arrow-left" aria-hidden="true" />
    </button>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function RegisterSection() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { clearError, registerAuth } = useAuth();
  const { toasts, toast, remove } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    clearErrors,
    formState: { errors },
    control,
  } = useForm<registerForm>({ resolver: zodResolver(registerSchema) });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [codigoExito, setCodigoExito] = useState(false);
  const [correoUsado, setCorreoUsado] = useState("");
  const [usernameUsado, setUsernameUsado] = useState("");

  const watchedName = watch("perfilUser.firstName");
  const watchedEmail = watch("user.email");
  const watchedUsername = watch("user.username");
  const watchedPassword = watch("user.password");

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleNext0 = async () => {
    const ok = await trigger(["user.email", "user.username"]);
    if (!ok) return;

    const [usernameResult, emailResult] = await Promise.allSettled([
      validarUsername(watchedUsername),
      enviarCodigoEmail(watchedEmail),
    ]);

    let hasError = false;

    if (
      usernameResult.status === "rejected" ||
      !usernameResult.value?.data?.available
    ) {
      setUsernameUsado("Este nombre de usuario ya está en uso");
      hasError = true;
    }

    if (emailResult.status === "rejected") {
      setCorreoUsado(
        emailResult.reason?.message ?? "No se pudo enviar el código.",
      );
      hasError = true;
    }

    if (hasError) return;

    toast("¡Código enviado a tu correo!", "success");
    setStep(1);
  };
  // Paso 1 es OTP — avanza desde onSuccess del componente OtpInput

  const handleNext2 = async () => {
    const ok = await trigger([
      "perfilUser.firstName",
      "perfilUser.lastName",
      "perfilUser.birthDate",
    ]);
    if (ok) {
      clearErrors(["user.password", "user.confirmPassword"]);
      setStep(3);
    }
  };

  const handleNext3 = async () => {
    const ok = await trigger(["user.password", "user.confirmPassword"]);
    if (ok) setStep(4);
  };

  const submit = async (data: registerForm) => {
    if (!acceptedTerms) return;
    setIsLoading(true);
    try {
      await registerAuth(data);
      navigate("/public/user/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Paso 1: OTP — pantalla completa independiente ────────────────────────

  if (step === 1) {
    return (
      <>
        <Toaster toasts={toasts} onRemove={remove} /> {/* ← Agrega esto */}
        <OtpInput
          email={watchedEmail}
          onSuccess={() => {
            setCodigoExito(true);
            setStep(2);
          }}
          onBack={() => {
            setStep(0);
          }}
          onResend={async () => {
            await enviarCodigoEmail(watchedEmail);
          }}
        />
      </>
    );
  }

  // ─── Render principal ─────────────────────────────────────────────────────

  return (
    <>
      <Toaster toasts={toasts} onRemove={remove} />
      <section className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-[#0b0b16] overflow-hidden">
        <Header />

        {/* Orbes */}
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-violet-600/[0.09] blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/[0.06] blur-[90px] rounded-full pointer-events-none" />

        {/* Grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Línea superior */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent" />

        {/* Badge */}
        <div className="absolute top-6 right-6 hidden lg:flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="font-ui text-[10px] tracking-[0.12em] uppercase text-white/20">
            Sesión segura
          </span>
        </div>

        {/* Card */}
        <div className="relative z-10 top-8 w-full max-w-[420px]">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-4 h-px bg-violet-500/60" />
            <span className="font-ui text-[10px] tracking-[0.15em] uppercase text-violet-500">
              Crear cuenta
            </span>
          </div>

          <h1 className="font-display text-h1 text-white font-semibold mb-1 tracking-tight">
            Empieza{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
              gratis
            </span>
          </h1>
          <p className="font-body text-small text-white/30 font-light mb-6">
            Sin tarjeta de crédito. Sin compromisos.
          </p>

          <form onSubmit={handleSubmit(submit)}>
            <Stepper steps={STEPS} current={step} />

            {/* ── Paso 0: cuenta ───────────────────────────────────────── */}
            {step === 0 && (
              <div className="animate-[fadeUp_0.2s_ease]">
                <p className="font-body text-small text-white/40 mb-5">
                  Cuéntanos un poco de ti para comenzar.
                </p>

                <Input
                  label="Nombre de usuario"
                  icon={
                    <i
                      className="ti ti-user text-white/35 text-base"
                      aria-hidden="true"
                    />
                  }
                  type="text"
                  placeholder="maria123"
                  error={errors.user?.username?.message}
                  {...register("user.username")}
                  onChange={(e) => {
                    register("user.username").onChange(e);
                    setUsernameUsado("");
                  }}
                />
                {usernameUsado && (
                  <p className="-mt-3 mb-4 font-body text-caption text-red-400 flex items-center gap-1">
                    <i className="ti ti-alert-circle" />
                    {usernameUsado}
                  </p>
                )}

                <Input
                  label="Correo electrónico"
                  icon={
                    <img
                      src={MailIcon}
                      className="w-4 h-4 invert opacity-50"
                      alt="icono de correo electrónico"
                    />
                  }
                  type="email"
                  placeholder="tu@correo.com"
                  error={errors.user?.email?.message}
                  {...register("user.email")}
                  onChange={(e) => {
                    register("user.email").onChange(e);
                    setCorreoUsado("");
                    clearError();
                  }}
                />

                {correoUsado && (
                  <p className="-mt-3 mb-4 font-body text-caption text-red-400 flex items-center gap-1">
                    <i className="ti ti-alert-circle" />
                    {correoUsado}
                  </p>
                )}

                <PrimaryButton
                  onClick={handleNext0}
                  className="mb-4 text-white"
                >
                  Verificar Correo{" "}
                  <i className="ti ti-arrow-right ml-1" aria-hidden="true" />
                </PrimaryButton>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.07]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#0b0b16] px-3 font-ui text-[11px] text-white/20">
                      o regístrate con
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <SocialButton
                    icon={<img src={GoogleIcon} className="w-5 h-5" alt="" />}
                    label="Google"
                  />
                  <SocialButton
                    icon={<img src={FacebookIcon} className="w-5 h-5" alt="" />}
                    label="Facebook"
                  />
                </div>

                <p className="font-body text-caption text-center text-white/35 font-light">
                  ¿Ya tienes cuenta?{" "}
                  <Link
                    to="/login"
                    className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-2 transition-colors duration-150"
                  >
                    Inicia sesión
                  </Link>
                </p>
              </div>
            )}

            {/* ── Paso 2: datos personales ──────────────────────────────── */}
            {step === 2 && (
              <div className="animate-[fadeUp_0.2s_ease]">
                <p className="font-body text-small text-white/40 mb-5">
                  Completa tu información personal.
                </p>
                <Input
                  label="Nombre"
                  icon={
                    <i
                      className="ti ti-user text-white/35 text-base"
                      aria-hidden="true"
                    />
                  }
                  type="text"
                  placeholder="María"
                  error={errors.perfilUser?.firstName?.message}
                  {...register("perfilUser.firstName")}
                  onChange={(e) => {
                    register("perfilUser.firstName").onChange(e);
                    clearError();
                  }}
                />
                <Input
                  label="Apellido"
                  icon={
                    <i
                      className="ti ti-user text-white/35 text-base"
                      aria-hidden="true"
                    />
                  }
                  type="text"
                  placeholder="González"
                  error={errors.perfilUser?.lastName?.message}
                  {...register("perfilUser.lastName")}
                  onChange={(e) => {
                    register("perfilUser.lastName").onChange(e);
                    clearError();
                  }}
                />
                <Controller
                  name="perfilUser.birthDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Fecha de nacimiento"
                      error={errors.perfilUser?.birthDate?.message}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
                <div className="flex gap-3 mt-2">
                  <BackButton onClick={() => setStep(1)} />
                  <PrimaryButton onClick={handleNext2} className="flex-1">
                    Continuar{" "}
                    <i className="ti ti-arrow-right ml-1" aria-hidden="true" />
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* ── Paso 3: contraseña ───────────────────────────────────── */}
            {step === 3 && (
              <div className="animate-[fadeUp_0.2s_ease]">
                <p className="font-body text-small text-white/40 mb-5">
                  Elige una contraseña segura para proteger tu cuenta.
                </p>

                <Input
                  label="Contraseña"
                  icon={
                    <img
                      src={LockIcon}
                      className="w-4 h-4 invert opacity-50"
                      alt="icono de candado"
                    />
                  }
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  error={errors.user?.password?.message}
                  {...register("user.password")}
                  onChange={(e) => {
                    register("user.password").onChange(e);
                    clearError();
                  }}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      <img
                        src={showPassword ? EyeClosed : EyeOpen}
                        className="w-5 h-5 invert opacity-25 hover:opacity-60 transition-opacity duration-150"
                        alt=""
                      />
                    </button>
                  }
                />

                <StrengthBar password={watchedPassword ?? ""} />

                <Input
                  label="Confirmar contraseña"
                  icon={
                    <img
                      src={LockIcon}
                      className="w-4 h-4 invert opacity-50"
                      alt="icono de candado"
                    />
                  }
                  type={showConfirm ? "text" : "password"}
                  placeholder="Repite tu contraseña"
                  error={errors.user?.confirmPassword?.message}
                  {...register("user.confirmPassword")}
                  onChange={(e) => {
                    register("user.confirmPassword").onChange(e);
                    clearError();
                  }}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      aria-label={
                        showConfirm
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      <img
                        src={showConfirm ? EyeClosed : EyeOpen}
                        className="w-5 h-5 invert opacity-25 hover:opacity-60 transition-opacity duration-150"
                        alt=""
                      />
                    </button>
                  }
                />

                <div className="flex gap-3 mt-2">
                  <BackButton onClick={() => setStep(2)} />
                  <PrimaryButton onClick={handleNext3} className="flex-1">
                    Continuar{" "}
                    <i className="ti ti-arrow-right ml-1" aria-hidden="true" />
                  </PrimaryButton>
                </div>
              </div>
            )}

            {/* ── Paso 4: confirmación final ───────────────────────────── */}
            {step === 4 && (
              <div className="animate-[fadeUp_0.2s_ease]">
                <p className="font-body text-small text-white/40 mb-5">
                  Revisa tu información antes de crear la cuenta.
                </p>

                <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 mb-5 space-y-2.5">
                  {[
                    { label: "Nombre", value: watchedName, accent: false },
                    { label: "Contraseña", value: "••••••••", accent: false },
                  ].map(({ label, value, accent }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center"
                    >
                      <span className="font-ui text-caption text-white/30">
                        {label}
                      </span>
                      <span
                        className={`font-ui text-caption ${accent ? "text-violet-400" : "text-white/70"}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center">
                    <span className="font-ui text-caption text-white/30">
                      Correo
                    </span>
                    <span className="flex items-center gap-1.5 font-ui text-caption text-violet-400">
                      {watchedEmail}
                      {codigoExito && (
                        <span
                          title="Correo verificado"
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded-full
                   bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                        >
                          <i
                            className="ti ti-circle-check text-[11px]"
                            aria-hidden="true"
                          />
                          <span className="text-[10px] font-ui tracking-wide">
                            Verificado
                          </span>
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                <label className="flex items-start gap-3 mb-6 cursor-pointer">
                  <div className="relative mt-0.5 flex-shrink-0">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <div className="w-4 h-4 rounded border border-white/[0.18] bg-white/[0.04] peer-checked:bg-violet-600 peer-checked:border-violet-600 transition-all duration-150" />
                    <i
                      className="ti ti-check absolute inset-0 flex items-center justify-center text-white text-[10px] opacity-0 peer-checked:opacity-100 transition-opacity duration-150"
                      aria-hidden="true"
                    />
                  </div>
                  <span className="font-body text-caption text-white/30 leading-relaxed font-light">
                    Acepto los{" "}
                    <a
                      href="/terms"
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors duration-150"
                    >
                      Términos de uso
                    </a>{" "}
                    y la{" "}
                    <a
                      href="/privacy"
                      className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors duration-150"
                    >
                      Política de privacidad
                    </a>
                  </span>
                </label>

                <div className="flex gap-3">
                  <BackButton
                    onClick={() => {
                      clearErrors(["user.password", "user.confirmPassword"]);
                      setStep(3);
                    }}
                  />{" "}
                  <PrimaryButton
                    disabled={!acceptedTerms || isLoading}
                    type="submit"
                    className="flex-1"
                  >
                    {isLoading ? "Creando cuenta..." : "Crear cuenta gratis"}
                  </PrimaryButton>
                </div>
              </div>
            )}
          </form>

          {/* SSL */}
          <div className="flex items-center justify-center gap-2 text-white/[0.18] mt-6">
            <img
              src={ShieldIcon}
              alt=""
              className="w-4 h-4 invert opacity-20"
            />
            <span className="font-ui text-[11px] tracking-wider">
              Cifrado SSL · Datos protegidos
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

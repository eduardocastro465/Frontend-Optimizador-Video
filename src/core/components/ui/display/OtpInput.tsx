import {
  useRef,
  useState,
  useEffect,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { MailIcon } from "../../../../assets";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import { verificarCodigoEmail } from "../../../services/auth.services";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

// ─── Timer hook ───────────────────────────────────────────────────────────────

function useCountdown(initial: number) {
  const [seconds, setSeconds] = useState(initial);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds, running]);

  const restart = () => {
    setSeconds(initial);
    setRunning(true);
  };

  return { seconds, done: !running, restart };
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface OtpInputProps {
  email?: string;
  onSuccess?: () => void;
  onResend?: () => Promise<void>;
  onBack?: () => void;
}

export default function OtpInput({
  email = "tu@correo.com",
  onSuccess,
  onResend,
  onBack,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { seconds, done, restart } = useCountdown(RESEND_SECONDS);

  const code = digits.join("");
  const isFull = code.length === OTP_LENGTH;

  const focusCell = (index: number) => inputsRef.current[index]?.focus();

  const clearStatus = () => {
    setStatus("idle");
    setMessage("");
  };

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    clearStatus();
    if (digit && index < OTP_LENGTH - 1) focusCell(index + 1);

    // ← Envía automáticamente cuando se completan los 6 dígitos
    const codigoCompleto = next.join("");
    if (codigoCompleto.length === OTP_LENGTH && next.every((d) => d !== "")) {
      handleVerify(codigoCompleto);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = "";
      setDigits(next);
      focusCell(index - 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setDigits(next);
    focusCell(Math.min(pasted.length, OTP_LENGTH - 1));
    clearStatus();

    // ← Envía automáticamente si el pegado completó los 6 dígitos

    if (next.every((d) => d !== "")) {
      setTimeout(() => handleVerify(next.join("")), 100);
    }
  };

  const handleVerify = async (codigoParam?: string) => {
    const codigoFinal = codigoParam ?? code;
    if (codigoFinal.length < OTP_LENGTH) return;

    setIsLoading(true);
    try {
      await verificarCodigoEmail(email, codigoFinal); // ← llama al backend
      setStatus("success");
      setMessage("¡Correo verificado correctamente!");
      onSuccess?.();
    } catch {
      setStatus("error");
      setMessage("Código incorrecto. Inténtalo de nuevo.");
      setDigits(Array(OTP_LENGTH).fill(""));
      focusCell(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyClick = () => handleVerify();

  const handleResend = async () => {
    if (!done) return;
    try {
      await onResend?.();
      setMessage("Código reenviado.");
      setStatus("success");
      restart();
    } catch {
      setStatus("error");
      setMessage("No se pudo reenviar. Inténtalo más tarde.");
    }
  };

  // ─── Estilos por estado ────────────────────────────────────────────────────

  const cellClass = (index: number) => {
    const base =
      "w-11 h-14 rounded-lg border text-center text-xl font-semibold font-heading bg-white/[0.03] text-white outline-none transition-all duration-150 caret-transparent";
    const filled = digits[index] ? "border-white/25" : "border-white/[0.10]";
    if (status === "error")
      return `${base} border-red-400/60 focus:border-red-400/80`;
    if (status === "success") return `${base} border-emerald-400/60`;
    return `${base} ${filled} focus:border-violet-500/70 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.12)]`;
  };

  const messageClass =
    status === "error"
      ? "text-red-400/80"
      : status === "success"
        ? "text-emerald-400/80"
        : "";

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-12 bg-[#0b0b16] overflow-hidden">
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

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-4 h-px bg-violet-500/60" />
          <span className="font-ui text-[10px] tracking-[0.15em] uppercase text-violet-500">
            Verificación
          </span>
        </div>

        <h1 className="font-display text-h1 text-white font-semibold mb-1 tracking-tight">
          Revisa tu{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
            correo
          </span>
        </h1>

        <p className="font-body text-small text-white/30 font-light mb-8">
          Enviamos un código de 6 dígitos a{" "}
          <span className="text-white/60">{email}</span>
        </p>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/30 hover:text-violet-400 text-sm transition-colors duration-150 mb-6"
          >
            <i className="ti ti-arrow-left text-sm" aria-hidden="true" />
            <span className="font-ui text-[11px] tracking-wide">
              Corregir correo
            </span>
          </button>
        )}
        {/* Icono */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center">
            <img src={MailIcon} className="w-6 h-6 invert opacity-40" alt="" />
          </div>
        </div>

        {/* Inputs OTP */}
        <div
          className="flex justify-center gap-2.5 mb-3"
          role="group"
          aria-label="Código de verificación"
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              className={cellClass(i)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              aria-label={`Dígito ${i + 1}`}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {/* Mensaje de error / éxito */}
        <p
          className={`font-body text-caption text-center mb-5 min-h-[18px] ${messageClass}`}
        >
          {message}
        </p>

        {/* Botón verificar */}
        <PrimaryButton
          disabled={!isFull || isLoading || status === "success"}
          onClick={handleVerifyClick}
          className="mb-4"
        >
          {isLoading ? "Verificando..." : "Verificar correo"}
        </PrimaryButton>

        {/* Reenviar */}
        <p className="font-body text-caption text-center text-white/35 font-light">
          ¿No recibiste el código?{" "}
          {done ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-2 transition-colors duration-150"
            >
              Reenviar código
            </button>
          ) : (
            <span className="text-white/20">Reenviar en {seconds}s</span>
          )}
        </p>
      </div>
    </section>
  );
}

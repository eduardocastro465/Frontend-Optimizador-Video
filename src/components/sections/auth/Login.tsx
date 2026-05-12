import { useState } from "react";

import {
  ArrowSignIn,
  ShieldIcon,
  LockIcon,
  MailIcon,
  FacebookIcon,
  GoogleIcon,
  EyeOpen,
  EyeClosed,
} from "../../../assets";

import Input from "../../ui/inputs/Input";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import SocialButton from "../../ui/buttons/SocialButton";
import Divider from "../../ui/display/Divider";

import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const result = await login(email, password);
    if (result) {
      navigate("/app");
    } else {
      console.log("Error al iniciar sesión");
    }
  };

  return (
    <section className="relative flex items-center justify-center px-10 py-8 pt-24 bg-[#0b0b16] border-l border-white/[0.05] overflow-hidden">
      {" "}
      {/* Orbes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/[0.11] blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/[0.07] blur-[90px] rounded-full pointer-events-none" />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* Badge seguro */}
      <div className="absolute top-6 right-6 hidden lg:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
        <span className="font-ui text-micro tracking-wider uppercase text-white/20">
          Sesión segura
        </span>
      </div>
      {/* Formulario */}
      <div className="relative z-10 w-full max-w-[380px]">
        {/* Header mobile */}
        <div className="lg:hidden py-8 pt-2 mb-1 text-center">
          <h1 className="font-heading text-h1 font-semibold mb-1">
            Bienvenido
          </h1>
          <h2 className="font-heading text-h2 font-semibold leading-tight mb-2">
            Inicia <span className="text-violet-400">sesión</span>
          </h2>
          <p className="font-body text-white/35 text-small font-light">
            Inicia sesión para continuar
          </p>
        </div>

        {/* Header desktop */}
        <div className="hidden lg:block mb-4">
          <h1 className="font-display text-h1 text-violet-500 font-semibold mb-1">
            Bienvenido
          </h1>
          <h2 className="font-heading text-h2 font-semibold tracking-tight mb-2">
            Inicia <span className="text-violet-400">sesión</span>
          </h2>
          <p className="font-body text-white/35 text-small font-light">
            Accede a tu espacio de trabajo
          </p>
        </div>

        <Input
          label="Correo electrónico"
          icon={
            <img src={MailIcon} className="w-4 h-4 invert opacity-60" alt="" />
          }
          type="email"
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Contraseña"
          icon={
            <img src={LockIcon} alt="" className="w-4 h-4 invert opacity-60" />
          }
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          rightElement={
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="transition-opacity duration-150"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              <img
                src={showPassword ? EyeClosed : EyeOpen}
                className="w-5 h-5 invert opacity-25 hover:opacity-65 transition-opacity duration-150"
                alt=""
              />
            </button>
          }
        />

        <div className="text-right mb-5">
          <a
            href="#"
            className="font-ui text-caption underline text-violet-400 hover:text-violet-300 transition-colors duration-150"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        <PrimaryButton
          onClick={handleSubmit}
          icon={<img src={ArrowSignIn} alt="" className="w-4 h-4 " />}
          className="mb-4"
        >
          Iniciar sesión
        </PrimaryButton>

        <div className="mb-4">
          <Divider />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <SocialButton
            icon={<img src={GoogleIcon} className="w-5 h-5" alt="" />}
            label="Google"
          />
          <SocialButton
            icon={<img src={FacebookIcon} className="w-5 h-5 " alt="" />}
            label="Facebook"
          />
        </div>

        <p className="font-body text-caption text-center text-white/40 font-light mb-3">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-violet-400 hover:text-violet-300 font-medium underline transition-colors duration-150"
          >
            Regístrate gratis
          </a>
        </p>

        <div className="flex items-center justify-center gap-2 text-white/20">
          <img src={ShieldIcon} alt="" className="w-4 h-4 invert opacity-20" />
          <span className="font-ui text-caption tracking-wide">
            Cifrado SSL · Datos protegidos
          </span>
        </div>
      </div>
    </section>
  );
}

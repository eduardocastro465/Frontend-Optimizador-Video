import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleLogin } from "@react-oauth/google";

import {
  ArrowSignIn,
  ShieldIcon,
  LockIcon,
  MailIcon,
  FacebookIcon,
  EyeOpen,
  EyeClosed,
} from "../../assets";

import Input from "../components/ui/inputs/Input";
import PrimaryButton from "../components/ui/buttons/PrimaryButton";
import SocialButton from "../components/ui/buttons/SocialButton";
import Divider from "../components/ui/display/Divider";
import { loginSchema, type LoginForm } from "../schemas/auth.schema";

import { useAuth } from "../hooks/useAuth";

export default function LoginSection() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // valida cada que se hace algun cambio
  });

  const { loginAuth, loginAuthGoogle, isLoading, error, clearError } =
    useAuth();
  const navigate = useNavigate();

  const submit = async (data: LoginForm) => {
    try {
      const ok = await loginAuth(data.identifier, data.password);

      if (ok) navigate("/public/user");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="relative flex items-center justify-center px-10 py-4 pt-20   bg-[#0b0b16] border-l border-white/[0.05] overflow-visible">
      {/* Orbes */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/[0.11] blur-[110px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-500/[0.07] blur-[90px] rounded-full pointer-events-none" />
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
      <form
        onSubmit={handleSubmit(submit)}
        className="relative z-10 w-full max-w-[380px]"
      >
        {/* Header mobile */}
        <div className="lg:hidden py-6 pt-2 mb-1 text-center">
          <h1 className="font-heading text-h1 font-semibold mb-1">
            Bienvenido
          </h1>
          <h2 className="font-heading text-h2 font-semibold leading-tight mb-2">
            Inicia <span className="text-violet-400">sesión</span>
          </h2>
        </div>

        {/* Header desktop */}
        <div className="hidden lg:block mb-2">
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

        {/* Input identifier */}
        <Input
          label="Correo o usuario"
          icon={
            <img src={MailIcon} className="w-4 h-4 invert opacity-60" alt="" />
          }
          type="text"
          placeholder="tu@correo.com o @usuario"
          error={errors.identifier?.message}
          {...register("identifier")}
          onChange={(e) => {
            register("identifier").onChange(e);
            clearError();
          }}
        />

        {/* Input password */}
        <Input
          label="Contraseña"
          icon={
            <img src={LockIcon} alt="" className="w-4 h-4 invert opacity-60" />
          }
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
          onChange={(e) => {
            register("password").onChange(e);
            clearError();
          }}
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
        {/* {errors.password && <span>{errors.password?.message}</span>} */}

        {/* Olvidaste contraseña */}
        <div className="text-right mb-5">
          <a
            href="#"
            className="font-ui text-caption underline text-violet-400 hover:text-violet-300 transition-colors duration-150"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Botón submit */}
        <PrimaryButton
          disabled={!isValid || isLoading}
          icon={<img src={ArrowSignIn} alt="" className="w-4 h-4" />}
          className="mb-2"
        >
          {isLoading ? "Iniciando..." : "Iniciar sesión"}
        </PrimaryButton>

        {/* Error message */}
        {error && (
          <p className="font-ui text-caption text-red-400 mb-3 text-center">
            {error}
          </p>
        )}

        <div className="mb-2">
          <Divider />
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-3 mb-2">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              const ok = await loginAuthGoogle(credentialResponse.credential!);
              if (ok) navigate("/public/user");
            }}
            onError={() => console.log("Error")}
            theme="filled_black"
            shape="rectangular"
            size="large"
          />
          <SocialButton
            icon={<img src={FacebookIcon} className="w-5 h-5" alt="" />}
            label="Facebook"
          />
        </div>

        {/* Registro */}
        <p className="font-body text-caption text-center text-white/40 font-light mb-3">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-violet-400 hover:text-violet-300 font-medium underline transition-colors duration-150"
          >
            Regístrate gratis
          </Link>
        </p>

        {/* SSL */}
        <div className="flex items-center justify-center gap-2 text-white/20">
          <img src={ShieldIcon} alt="" className="w-4 h-4 invert opacity-20" />
          <span className="font-ui text-caption tracking-wide">
            Cifrado SSL · Datos protegidos
          </span>
        </div>
      </form>
    </section>
  );
}

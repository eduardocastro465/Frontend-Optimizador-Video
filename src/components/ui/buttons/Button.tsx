import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variants = {
  primary:   "bg-gradient-to-br from-violet-700 to-violet-600 text-white hover:opacity-90",
  secondary: "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.09] hover:border-white/[0.18] text-white/55 hover:text-white",
  ghost:     "hover:bg-white/[0.06] text-white/55 hover:text-white",
  danger:    "bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300",
};

const sizes = {
  sm: "px-3 py-1 text-caption",
  md: "px-4 py-2.5 text-small",
  lg: "px-6 py-3 text-body",
};

export default function Button({
  children,
  variant = "secondary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-ui font-medium
        active:scale-[0.985] transition-all duration-150
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
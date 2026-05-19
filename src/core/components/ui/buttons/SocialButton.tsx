import type { ButtonHTMLAttributes, ReactNode } from "react";

interface SocialButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

export default function SocialButton({
  icon,
  label,
  className = "",
  ...props
}: SocialButtonProps) {
  return (
    <button
      className={`
        flex items-center justify-center gap-2.5 py-2.5
       bg-white/5 hover:bg-white/10
        border border-white/[0.09] hover:border-white/[0.18] rounded-xl
        font-ui text-small text-white/55 hover:text-white
        transition-all duration-150
        ${className}
      `}
      {...props}
    >
      {icon}
      {label}
    </button>
  );
}
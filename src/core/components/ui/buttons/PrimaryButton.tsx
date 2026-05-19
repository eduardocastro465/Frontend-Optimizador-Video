import type { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
}

export default function PrimaryButton({
  children,
  icon,
  className = "",
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`
        w-full flex items-center justify-center gap-2.5
        py-2.5 rounded-xl
        bg-gradient-to-br from-violet-700 to-violet-600
        font-ui text-small font-medium tracking-wide
        hover:opacity-90 active:scale-[0.985]
        transition-all duration-150
        ${className}
      `}
      {...props}
    >
      {children}
      {icon && icon}
    </button>
  );
}
import { forwardRef } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

const inputCls = `
  w-full px-4 py-2.5
  bg-white/[0.04] border border-white/[0.09] rounded-xl
  text-body text-white font-light placeholder:text-white/20
  outline-none transition-all duration-200
  focus:border-violet-500/60 focus:bg-violet-900/[0.08]
  focus:ring-[3px] focus:ring-violet-500/10
  [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_#0b0b16]
  [&:-webkit-autofill]:[-webkit-text-fill-color:white]
  [&:-webkit-autofill:hover]:shadow-[inset_0_0_0px_1000px_#0b0b16]
  [&:-webkit-autofill:focus]:shadow-[inset_0_0_0px_1000px_#0b0b16]
  [&:-webkit-autofill:active]:shadow-[inset_0_0_0px_1000px_#0b0b16]
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-") || "input";

    return (
      <div className="mb-4">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-ui text-caption font-medium tracking-wider text-white/60 mb-2"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-4 text-white/25 pointer-events-none">
              {icon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
            ${inputCls}
            ${icon ? "pl-11" : ""}
            ${rightElement ? "!pr-12" : ""}
            ${error ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/10" : ""}
            ${className}
          `}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-4">{rightElement}</div>
          )}
        </div>
        <p className="font-ui text-caption text-red-400 mt-1.5 min-h-[8px]">
          {error}
        </p>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;

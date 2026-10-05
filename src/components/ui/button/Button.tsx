import { cn } from "@/utils";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  /** "primary" — ink pill (default CTA); "brand" — Aris red, for the single most important action on a surface; "outline" — quiet secondary. */
  variant?: "primary" | "brand" | "outline";
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Extra classes
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
}) => {
  const sizeClasses = {
    sm: "h-10 px-4.5 text-sm flat:h-9 flat:px-3.5",
    md: "h-12 px-6 text-sm flat:h-10 flat:px-4",
  };

  const variantClasses = {
    primary:
      "bg-ink text-white hover:bg-gray-800 disabled:bg-gray-400 dark:bg-white dark:text-ink dark:hover:bg-gray-200",
    brand:
      "bg-brand-500 text-white hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-ink ring-1 ring-inset ring-gray-200 flat:ring-gray-300 flat:shadow-theme-xs hover:bg-gray-50 dark:bg-white/5 dark:text-gray-200 dark:ring-white/10 dark:hover:bg-white/10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-150 flat:rounded-lg",
        sizeClasses[size],
        variantClasses[variant],
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;

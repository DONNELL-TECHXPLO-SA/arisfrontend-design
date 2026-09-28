import { cn } from "@/utils";

type BadgeVariant = "light" | "solid";
type BadgeSize = "sm" | "md";
type BadgeColor =
  "primary" | "success" | "error" | "warning" | "info" | "light" | "dark";

interface BadgeProps {
  variant?: BadgeVariant; // "light" — neutral chip with a status dot; "solid" — filled pill
  size?: BadgeSize; // Badge size
  color?: BadgeColor; // Badge color
  startIcon?: React.ReactNode; // Icon at the start (replaces the dot on light badges)
  endIcon?: React.ReactNode; // Icon at the end
  children: React.ReactNode; // Badge content
}

// Status reads from the dot, not a tinted fill — keeps long tables calm and lets
// colour carry meaning without every row turning into a rainbow.
const dotColors: Record<BadgeColor, string> = {
  primary: "bg-brand-500",
  success: "bg-success-500",
  error: "bg-error-500",
  warning: "bg-warning-400",
  info: "bg-blue-light-500",
  light: "bg-gray-300 dark:bg-gray-600",
  dark: "bg-ink dark:bg-white",
};

const solidColors: Record<BadgeColor, string> = {
  primary: "bg-brand-500 text-white",
  success: "bg-success-500 text-white",
  error: "bg-error-500 text-white",
  warning: "bg-warning-500 text-white",
  info: "bg-blue-light-500 text-white",
  light: "bg-gray-200 text-gray-700 dark:bg-white/10 dark:text-white/80",
  dark: "bg-ink text-white dark:bg-white dark:text-ink",
};

const Badge: React.FC<BadgeProps> = ({
  variant = "light",
  color = "primary",
  size = "md",
  startIcon,
  endIcon,
  children,
}) => {
  const sizeStyles = {
    sm: "text-theme-xs py-0.5",
    md: "text-sm py-1",
  };

  if (variant === "solid") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center gap-1 rounded-full px-2.5 font-medium",
          sizeStyles[size],
          solidColors[color],
        )}
      >
        {startIcon && <span className="me-0.5">{startIcon}</span>}
        {children}
        {endIcon && <span className="ms-0.5">{endIcon}</span>}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 font-medium whitespace-nowrap text-gray-700 dark:bg-white/[0.06] dark:text-gray-200",
        sizeStyles[size],
      )}
    >
      {startIcon ?? <span className={cn("size-1.5 shrink-0 rounded-full", dotColors[color])} />}
      {children}
      {endIcon && <span className="ms-0.5">{endIcon}</span>}
    </span>
  );
};

export default Badge;

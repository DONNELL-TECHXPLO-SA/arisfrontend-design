import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/utils";
import { Moon, Sun } from "lucide-react";
import React from "react";

export const ThemeToggleButton: React.FC<{ className?: string }> = ({ className }) => {
  const { toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "relative flex size-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-ink dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white",
        className,
      )}
    >
      <Sun className="hidden size-[18px] dark:block" strokeWidth={1.75} />
      <Moon className="size-[18px] dark:hidden" strokeWidth={1.75} />
    </button>
  );
};

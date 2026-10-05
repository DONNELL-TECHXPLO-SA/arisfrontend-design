"use client";

import { cn } from "@/utils";
import { Search, X } from "lucide-react";

interface ClaimsSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function ClaimsSearchInput({ value, onChange, placeholder = "Search claims…", className }: ClaimsSearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute inset-s-4.5 top-1/2 size-[18px] -translate-y-1/2 text-gray-400 flat:inset-s-3 flat:size-4" strokeWidth={1.75} />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search claims"
        className="h-12 w-full rounded-full border-0 bg-white ps-12 pe-11 text-sm text-ink shadow-card flat:h-9 flat:rounded-lg flat:border flat:border-gray-200 flat:ps-10 flat:shadow-none dark:flat:border-white/10 placeholder:text-gray-400 focus:ring-4 focus:ring-ink/5 focus:outline-hidden dark:bg-gray-900 dark:text-white dark:placeholder:text-white/30 dark:focus:ring-white/5 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute inset-e-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink dark:hover:bg-white/5 dark:hover:text-white"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

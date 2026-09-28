"use client";

import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import Wordmark from "@/components/common/Wordmark";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import { homeForRole, isInternalRole, useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/utils";
import { Ellipsis, Menu, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

// Floating header — no bar, no rule. Search, the icon cluster and the user pill are
// separate white capsules sitting directly on the canvas.
const AppHeader: React.FC = () => {
  const t = useTranslations("header");
  const inputRef = useRef<HTMLInputElement>(null);
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const { isMobileOpen, toggleMobileSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const isClient = !!currentUser && !isInternalRole(currentUser.role);
  const claimsPath = isClient ? "/portal/claims" : "/claims";
  // The claims list has its own centred search — don't show two.
  const hideGlobalSearch = pathname === claimsPath;

  // Global search lands on the claims list with the query applied (it searches reference,
  // client, insurer, broker, status, insurer claim number and location).
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim() ?? "";
    router.push(q ? `${claimsPath}?q=${encodeURIComponent(q)}` : claimsPath);
    inputRef.current?.blur();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const capsule = "rounded-full bg-white shadow-card dark:bg-gray-900";

  return (
    <header className="sticky top-0 z-99999 w-full bg-canvas/50 backdrop-blur-md dark:bg-canvas-dark/50">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-3 px-4 py-3 md:px-6 xl:flex-row xl:items-center xl:justify-between xl:py-4">
        <div className="flex items-center justify-between gap-3">
          <button
            className={cn(capsule, "flex size-11 items-center justify-center text-gray-600 xl:hidden dark:text-gray-300")}
            onClick={toggleMobileSidebar}
            aria-label={t("toggleSidebar")}
          >
            {isMobileOpen ? <X className="size-5" strokeWidth={1.75} /> : <Menu className="size-5 rtl:-scale-x-100" strokeWidth={1.75} />}
          </button>

          <Link href={homeForRole(currentUser?.role ?? "broker")} className="xl:hidden">
            <Wordmark />
          </Link>

          <button
            onClick={() => setApplicationMenuOpen((v) => !v)}
            className={cn(capsule, "flex size-11 items-center justify-center text-gray-600 xl:hidden dark:text-gray-300")}
            aria-label="More"
          >
            <Ellipsis className="size-5" strokeWidth={1.75} />
          </button>

          <form className={cn("hidden", !hideGlobalSearch && "xl:block")} onSubmit={handleSearch} role="search">
            <div className="relative">
              <Search
                className="pointer-events-none absolute inset-s-5 top-1/2 size-[18px] -translate-y-1/2 text-gray-400"
                strokeWidth={1.75}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder={isClient ? "Search your claims…" : "Search claims, clients, insurers…"}
                aria-label="Search claims"
                className="h-12 w-105 rounded-full border-0 bg-white ps-12 pe-16 text-sm text-ink shadow-card placeholder:text-gray-400 focus:ring-4 focus:ring-ink/5 focus:outline-hidden dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:ring-white/5"
              />
              <kbd className="pointer-events-none absolute inset-e-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-full bg-gray-100 px-2.5 py-1 font-sans text-[11px] font-medium text-gray-500 dark:bg-white/5 dark:text-gray-400">
                ⌘K
              </kbd>
            </div>
          </form>
        </div>

        <div className={cn("items-center justify-between gap-3 xl:flex xl:justify-end", isApplicationMenuOpen ? "flex" : "hidden")}>
          <div className={cn(capsule, "flex items-center gap-1 p-1")}>
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

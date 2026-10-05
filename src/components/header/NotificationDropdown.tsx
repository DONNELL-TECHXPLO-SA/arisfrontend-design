"use client";

import { Link } from "@/i18n/navigation";
import { cn } from "@/utils";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import UserAvatar from "@/components/common/UserAvatar";
import { useState } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

export default function NotificationDropdown() {
  const t = useTranslations("header.notifications");
  const [isOpen, setIsOpen] = useState(false);
  const [notifying, setNotifying] = useState(true);

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleClick = () => {
    toggleDropdown();
    setNotifying(false);
  };
  return (
    <div className="relative">
      <button
        className="dropdown-toggle relative flex size-10 items-center justify-center rounded-full flat:size-9 flat:rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-ink dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white"
        aria-label={t("title")}
        onClick={handleClick}
      >
        <span
          className={cn(
            "absolute top-2 end-2.5 z-10 size-2 rounded-full bg-brand-500 ring-2 ring-white dark:ring-gray-900",
            !notifying ? "hidden" : "flex",
          )}
        >
          
        </span>
        <Bell className="size-[18px]" strokeWidth={1.75} />
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -left-13.5 mt-4.25 flex h-120 w-87.5 flex-col rounded-3xl bg-white p-3 shadow-float sm:w-90.25 xl:right-0 xl:left-auto dark:bg-gray-dark dark:ring-1 dark:ring-white/10"
      >
        <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t("title")}
          </h5>
          <button
            onClick={toggleDropdown}
            className="dropdown-toggle text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg
              className="fill-current"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.21967 7.28131C5.92678 6.98841 5.92678 6.51354 6.21967 6.22065C6.51256 5.92775 6.98744 5.92775 7.28033 6.22065L11.999 10.9393L16.7176 6.22078C17.0105 5.92789 17.4854 5.92788 17.7782 6.22078C18.0711 6.51367 18.0711 6.98855 17.7782 7.28144L13.0597 12L17.7782 16.7186C18.0711 17.0115 18.0711 17.4863 17.7782 17.7792C17.4854 18.0721 17.0105 18.0721 16.7176 17.7792L11.999 13.0607L7.28033 17.7794C6.98744 18.0722 6.51256 18.0722 6.21967 17.7794C5.92678 17.4865 5.92678 17.0116 6.21967 16.7187L10.9384 12L6.21967 7.28131Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <ul className="flex custom-scrollbar h-auto flex-col overflow-y-auto">
          {/* Example notification items */}
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-2xl p-3 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <span className="relative z-1 block h-10 w-full max-w-10 rounded-full">
                <UserAvatar name="Terry Franci" />
                <span className="absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Terry Franci
                  </span>
                  <span>{t("requestsPermission")}</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-theme-xs text-gray-500 dark:text-gray-400">
                  <span>{t("project")}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{t("minAgo", { count: 5 })}</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-2xl p-3 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <span className="relative z-1 block h-10 w-full max-w-10 rounded-full">
                <UserAvatar name="Alena Franci" />
                <span className="absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Alena Franci
                  </span>
                  <span>{t("requestsPermission")}</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-theme-xs text-gray-500 dark:text-gray-400">
                  <span>{t("project")}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{t("minAgo", { count: 8 })}</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-2xl p-3 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
              href="#"
            >
              <span className="relative z-1 block h-10 w-full max-w-10 rounded-full">
                <UserAvatar name="Jocelyn Kenter" />
                <span className="absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Jocelyn Kenter
                  </span>
                  <span>{t("requestsPermission")}</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-theme-xs text-gray-500 dark:text-gray-400">
                  <span>{t("project")}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{t("minAgo", { count: 15 })}</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-2xl p-3 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
              href="#"
            >
              <span className="relative z-1 block h-10 w-full max-w-10 rounded-full">
                <UserAvatar name="Brandon Philips" />
                <span className="absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Brandon Philips
                  </span>
                  <span>{t("requestsPermission")}</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-theme-xs text-gray-500 dark:text-gray-400">
                  <span>{t("project")}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{t("hrAgo", { count: 1 })}</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              className="flex gap-3 rounded-2xl p-3 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
              onItemClick={closeDropdown}
            >
              <span className="relative z-1 block h-10 w-full max-w-10 rounded-full">
                <UserAvatar name="Terry Franci" />
                <span className="absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Terry Franci
                  </span>
                  <span>{t("requestsPermission")}</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-theme-xs text-gray-500 dark:text-gray-400">
                  <span>{t("project")}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{t("minAgo", { count: 5 })}</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-2xl p-3 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <span className="relative z-1 block h-10 w-full max-w-10 rounded-full">
                <UserAvatar name="Alena Franci" />
                <span className="absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Alena Franci
                  </span>
                  <span>{t("requestsPermission")}</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-theme-xs text-gray-500 dark:text-gray-400">
                  <span>{t("project")}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{t("minAgo", { count: 8 })}</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-2xl p-3 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <span className="relative z-1 block h-10 w-full max-w-10 rounded-full">
                <UserAvatar name="Jocelyn Kenter" />
                <span className="absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-success-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Jocelyn Kenter
                  </span>
                  <span>{t("requestsPermission")}</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-theme-xs text-gray-500 dark:text-gray-400">
                  <span>{t("project")}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{t("minAgo", { count: 15 })}</span>
                </span>
              </span>
            </DropdownItem>
          </li>

          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              className="flex gap-3 rounded-2xl p-3 px-4.5 py-3 hover:bg-gray-50 dark:hover:bg-white/5"
              href="#"
            >
              <span className="relative z-1 block h-10 w-full max-w-10 rounded-full">
                <UserAvatar name="Brandon Philips" />
                <span className="absolute right-0 bottom-0 z-10 h-2.5 w-full max-w-2.5 rounded-full border-[1.5px] border-white bg-error-500 dark:border-gray-900"></span>
              </span>

              <span className="block">
                <span className="mb-1.5 block space-x-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Brandon Philips
                  </span>
                  <span>{t("requestsPermission")}</span>
                  <span className="font-medium text-gray-800 dark:text-white/90">
                    Project - Nganter App
                  </span>
                </span>

                <span className="flex items-center gap-2 text-theme-xs text-gray-500 dark:text-gray-400">
                  <span>{t("project")}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-400"></span>
                  <span>{t("hrAgo", { count: 1 })}</span>
                </span>
              </span>
            </DropdownItem>
          </li>
          {/* Add more items as needed */}
        </ul>
        <Link
          href="/"
          className="mt-3 block rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          {t("viewAll")}
        </Link>
      </Dropdown>
    </div>
  );
}

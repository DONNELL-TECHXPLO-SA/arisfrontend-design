import React from "react";

interface DashboardGreetingProps {
  firstName: string;
  subtitle: string;
  /** Right-aligned actions (buttons/links). */
  children?: React.ReactNode;
}

function greetingFor(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardGreeting({ firstName, subtitle, children }: DashboardGreetingProps) {
  const greeting = greetingFor(new Date().getHours());

  return (
    <div className="flex flex-col gap-5 pt-2 pb-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-title-sm font-medium tracking-tight text-ink sm:text-title-md dark:text-white">
          {greeting}, {firstName}
        </h1>
        <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}

import StatTile from "@/components/dashboard/StatTile";
import React from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  /** Context under the number, e.g. "Across all brokers". */
  hint?: string;
  icon: React.ReactNode;
  /** "attention" — the one number per row that needs action (solid Aris red). */
  tone?: "default" | "attention";
  href?: string;
}

// Dashboard stat card — the house StatTile with a hint line; tone="attention" is featured.
export default function StatCard({ label, value, hint, icon, tone = "default", href }: StatCardProps) {
  return <StatTile label={label} value={value} caption={hint} icon={icon} href={href} featured={tone === "attention"} />;
}

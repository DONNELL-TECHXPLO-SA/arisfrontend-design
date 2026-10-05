"use client";

import type { MockState } from "@/lib/mock/types";
import DashboardInsights from "./DashboardInsights";

// Claims activity — claims lodged per month and payout status, across the given state.
export default function ClaimsActivityCharts({ state }: { state: MockState }) {
  return <DashboardInsights claims={state.claims} />;
}

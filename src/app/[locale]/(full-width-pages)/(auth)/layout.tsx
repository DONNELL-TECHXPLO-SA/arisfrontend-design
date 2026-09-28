import AfricaStripes from "@/components/common/AfricaStripes";
import ThemeTogglerTwo from "@/components/common/ThemeTogglerTwo";
import Wordmark from "@/components/common/Wordmark";

import { ThemeProvider } from "@/context/ThemeContext";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 min-h-screen bg-monogram p-3">
      <ThemeProvider>
        <div className="relative flex min-h-[calc(100vh-1.5rem)] w-full flex-col gap-3 lg:flex-row">
          <div className="flex flex-1 flex-col rounded-[28px] bg-white px-6 py-8 shadow-card sm:px-10 dark:bg-gray-900">
            <Wordmark variant="lockup" />
            {children}
          </div>

          {/* Brand panel — charcoal, one oversized Africa drawn from the logo's own stripes,
              tone-on-tone with two red stripes as the only accent. */}
          <div className="relative hidden overflow-hidden rounded-[28px] bg-charcoal p-12 text-white lg:flex lg:w-[46%] lg:flex-col lg:justify-between">
            <AfricaStripes
              animate
              accent={[4, 8]}
              stripeClassName="stroke-white/[0.07]"
              accentClassName="stroke-brand-500"
              className="pointer-events-none absolute top-[13%] end-[7%] aspect-[146/164] h-[60%]"
            />

            <Wordmark tone="inverted" className="relative" />

            <div className="relative max-w-sm">
              <p className="text-title-sm leading-tight font-medium tracking-tight">
                Claims, handled with the care your clients expect.
              </p>
              <p className="mt-4 text-theme-sm text-white/50">Aris Brokers · Leave it to the experts</p>
            </div>
          </div>

          <div className="fixed end-6 bottom-6 z-50 hidden sm:block">
            <ThemeTogglerTwo />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

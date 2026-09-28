// Brand logo files, served from `public/images/logo/` (paths are relative to /public).
// Set a slot to `null` to fall back to the built-in text lockup (red "A" roundel + "Aris").
// To replace the artwork, overwrite the files (keep transparent backgrounds) or repoint these.
export const brandLogo: {
  /** Horizontal logo for light surfaces (mobile header, portal header). */
  full: string | null;
  /** Horizontal logo for dark surfaces (charcoal sidebar, dark mode). Falls back to `full`. */
  fullInverted: string | null;
  /** Logo with the "Leave it to the EXPERTS" tagline — sign-in screen. Falls back to `full`. */
  lockup: string | null;
  /** Tagline logo for dark surfaces. Falls back to `lockup`. */
  lockupInverted: string | null;
  /** Square icon (the Africa mark) for the collapsed sidebar. Falls back to the red roundel. */
  mark: string | null;
} = {
  full: "/images/logo/aris-logo.png",
  fullInverted: "/images/logo/aris-logo-inverted.png",
  lockup: "/images/logo/aris-logo-tagline.png",
  lockupInverted: "/images/logo/aris-logo-tagline-inverted.png",
  mark: "/images/logo/aris-mark.png",
};

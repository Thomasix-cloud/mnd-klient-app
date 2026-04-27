// ============================================================
// MND Klient — Color tokens
// ============================================================

export const Colors = {
  // Brand
  primary: "#00A651",
  primaryDark: "#008C45",
  primaryLight: "#E8F5E9",

  // Surfaces
  background: "#F5F7F8",
  card: "#FFFFFF",
  surfaceSubtle: "#F3F4F6",
  border: "#E5E7EB",
  borderSubtle: "#F1F2F4",

  // Text
  text: "#0F172A",
  textSecondary: "#64748B",
  textMuted: "#94A3B8",

  // Legacy aliases (backward compat)
  dark: "#0F172A",
  gray: "#64748B",
  grayLight: "#F3F4F6",
  grayMedium: "#CBD5E1",
  white: "#FFFFFF",
  red: "#EF4444",
  redLight: "#FEE2E2",
  orange: "#F59E0B",
  orangeLight: "#FEF3C7",
  blue: "#3B82F6",
  blueLight: "#DBEAFE",

  // Energy types
  electricity: "#3B82F6",
  electricityBg: "#DBEAFE",
  gas: "#F59E0B",
  gasBg: "#FEF3C7",
} as const;

// ----- Semantic tone tokens (preferred for new code) ---------
export type ToneName =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "brand";

export const Tones: Record<
  ToneName,
  { bg: string; text: string; solid: string; border: string }
> = {
  brand:   { bg: "#E8F5E9", text: "#00A651", solid: "#00A651", border: "#BCE7C9" },
  success: { bg: "#E8F5E9", text: "#067647", solid: "#10B981", border: "#BCE7C9" },
  warning: { bg: "#FEF3C7", text: "#B45309", solid: "#F59E0B", border: "#FCD34D" },
  danger:  { bg: "#FEE2E2", text: "#B91C1C", solid: "#EF4444", border: "#FCA5A5" },
  info:    { bg: "#DBEAFE", text: "#1D4ED8", solid: "#3B82F6", border: "#93C5FD" },
  neutral: { bg: "#F1F5F9", text: "#475569", solid: "#64748B", border: "#E2E8F0" },
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

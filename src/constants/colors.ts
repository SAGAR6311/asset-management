export const COLORS = {
  primary: {
    main: "#2563eb",
    light: "#3b82f6",
    dark: "#1e40af",
    contrast: "#ffffff",
  },
  secondary: {
    main: "#64748b",
    light: "#94a3b8",
    dark: "#475569",
  },
  success: {
    main: "#10b981",
    light: "#34d399",
    dark: "#059669",
  },
  warning: {
    main: "#f59e0b",
    light: "#fbbf24",
    dark: "#d97706",
  },
  error: {
    main: "#ef4444",
    light: "#f87171",
    dark: "#dc2626",
  },
  info: {
    main: "#3b82f6",
    light: "#60a5fa",
    dark: "#2563eb",
  },
  background: {
    default: "#f8fafc",
    paper: "#ffffff",
    dark: "#0f172a",
  },
  text: {
    primary: "#0f172a",
    secondary: "#64748b",
    disabled: "#cbd5e1",
    inverse: "#ffffff",
  },
  border: {
    light: "#e2e8f0",
    main: "#cbd5e1",
    dark: "#94a3b8",
  },
  status: {
    assigned: "#f59e0b",
    available: "#10b981",
    maintenance: "#ef4444",
  },
} as const;

export type ColorType = typeof COLORS;

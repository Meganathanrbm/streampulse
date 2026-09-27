import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "data-theme" },
  defaultColorScheme: "light",
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#2563eb", contrastText: "#ffffff" },
        error: { main: "#dc2626" },
        success: { main: "#16a34a" },
        text: { primary: "#0f172a", secondary: "#64748b" },
        background: { default: "#f1f5f9", paper: "#ffffff" },
        divider: "#e2e8f0",
      },
    },
    dark: {
      palette: {
        primary: { main: "#60a5fa", contrastText: "#0b1120" },
        error: { main: "#f87171" },
        success: { main: "#4ade80" },
        text: { primary: "#e5eaf3", secondary: "#94a3b8" },
        background: { default: "#0b1120", paper: "#111a2e" },
        divider: "#243049",
      },
    },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: "inherit", fontSize: 14 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none", border: "1px solid var(--border)" },
      },
    },
    MuiSelect: {
      defaultProps: { variant: "standard", disableUnderline: true },
      styleOverrides: { root: { fontSize: "inherit", fontWeight: 500 } },
    },
    MuiMenu: {
      defaultProps: {
        slotProps: { paper: { sx: { mt: 0.5, minWidth: 140 } } },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          "&:hover, &.Mui-focusVisible": {
            backgroundColor: "var(--surface-muted)",
          },
          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: "var(--surface-muted)",
            color: "var(--accent)",
            fontWeight: 500,
          },
        },
      },
    },
  },
});

export const colors = { primary: "#155EEF", primaryDark: "#0B4CD4", primarySoft: "#EAF1FF", navy: "#0C1C33", ink: "#17263D", muted: "#66758A", border: "#DDE4ED", canvas: "#F5F7FA", white: "#FFFFFF", green: "#12845B", danger: "#C9363E" };

export function createTheme(dark: boolean) {
  return dark
    ? { background: "#0D1522", surface: "#151F2E", text: "#F4F7FB", muted: "#9EABBA", border: "#293548", input: "#111B29" }
    : { background: colors.canvas, surface: colors.white, text: colors.ink, muted: colors.muted, border: colors.border, input: colors.white };
}

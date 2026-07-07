export function fmtDate(d: string): string {
  if (!d) return "";
  const [y, m] = d.split("-");
  if (!y || !m) return d;
  return `${new Date(Number(y), Number(m) - 1).toLocaleString("en-US", { month: "short" })} ${y}`;
}

export function contactLine(parts: (string | undefined)[], sep = "  ·  "): string {
  return parts.filter(Boolean).join(sep);
}

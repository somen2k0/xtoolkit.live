import { useState, useCallback, useEffect } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { AdSlot } from "@/components/AdSlot";
import { Copy, Palette, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const n = parseInt(clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function relativeLuminance(r: number, g: number, b: number): number {
  const sRGB = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const CSS_COLORS: Record<string, string> = {
  "#ff0000": "red", "#00ff00": "lime", "#0000ff": "blue", "#ffff00": "yellow",
  "#00ffff": "cyan", "#ff00ff": "magenta", "#ffffff": "white", "#000000": "black",
  "#808080": "gray", "#c0c0c0": "silver", "#800000": "maroon", "#008000": "green",
  "#000080": "navy", "#800080": "purple", "#008080": "teal", "#ffa500": "orange",
  "#ffc0cb": "pink", "#a52a2a": "brown", "#f5f5dc": "beige", "#7fffd4": "aquamarine",
};

const PALETTES = [
  { name: "Indigo", colors: ["#6366f1", "#4f46e5", "#4338ca", "#e0e7ff", "#c7d2fe"] },
  { name: "Emerald", colors: ["#10b981", "#059669", "#047857", "#d1fae5", "#a7f3d0"] },
  { name: "Rose", colors: ["#f43f5e", "#e11d48", "#be123c", "#ffe4e6", "#fecdd3"] },
  { name: "Amber", colors: ["#f59e0b", "#d97706", "#b45309", "#fef3c7", "#fde68a"] },
  { name: "Sky", colors: ["#0ea5e9", "#0284c7", "#0369a1", "#e0f2fe", "#bae6fd"] },
];

const faqs = [
  { q: "What is the difference between HEX, RGB, and HSL?", a: "HEX is a six-digit hexadecimal code used in web design (#1a2b3c). RGB specifies red, green, blue components (0–255). HSL (Hue, Saturation, Lightness) is often more intuitive for designers since it separates color (hue) from brightness (lightness)." },
  { q: "What is WCAG contrast ratio?", a: "WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios for text to be readable: AA requires 4.5:1 for normal text, AAA requires 7:1. The contrast checker shows whether your color pair meets these standards." },
  { q: "What does RGBA mean?", a: "RGBA adds an alpha (opacity) channel to RGB. The alpha value ranges from 0 (fully transparent) to 1 (fully opaque), allowing semi-transparent colors in CSS." },
];

const relatedTools = [
  { title: "CSS Minifier & Formatter", href: "/tools/css-minifier", description: "Minify or beautify CSS code." },
  { title: "Image Compressor", href: "/tools/image-compressor", description: "Compress images in your browser." },
  { title: "OG Image Preview", href: "/tools/og-image-preview", description: "Preview social media card images." },
];

export default function ColorPicker() {
  useToolView("color-picker");
  const { toast } = useToast();

  const [hex, setHex] = useState("#6366f1");
  const [hexInput, setHexInput] = useState("#6366f1");
  const [contrastHex, setContrastHex] = useState("#ffffff");
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const cssName = CSS_COLORS[hex.toLowerCase()] ?? null;

  const contrastRgb = hexToRgb(contrastHex);
  const contrastResult = rgb && contrastRgb ? (() => {
    const l1 = relativeLuminance(rgb.r, rgb.g, rgb.b);
    const l2 = relativeLuminance(contrastRgb.r, contrastRgb.g, contrastRgb.b);
    const ratio = contrastRatio(l1, l2);
    return {
      ratio: ratio.toFixed(2),
      aa: ratio >= 4.5,
      aaa: ratio >= 7,
      aaLarge: ratio >= 3,
      aaaLarge: ratio >= 4.5,
    };
  })() : null;

  const applyColor = useCallback((newHex: string) => {
    const clean = newHex.startsWith("#") ? newHex : `#${newHex}`;
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
      setHex(clean);
      setHexInput(clean);
      setRecentColors((prev) => [clean, ...prev.filter((c) => c !== clean)].slice(0, 20));
    }
  }, []);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const formats = rgb && hsl ? [
    { label: "HEX", value: hex.toUpperCase() },
    { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: "RGBA", value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
  ] : [];

  return (
    <MiniToolLayout
      seoTitle="Color Picker & Converter — Free HEX, RGB, HSL Tool | X Toolkit"
      seoDescription="Pick any color and instantly convert between HEX, RGB, HSL, and RGBA formats. Free online color picker for designers and developers. No signup."
      icon={Palette}
      title="Color Picker & Converter"
      description="Pick any color and convert between HEX, RGB, HSL, and RGBA instantly."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />

      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Color picker */}
          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="pt-6 space-y-5">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <input
                    id="color-picker"
                    name="color-picker"
                    type="color"
                    value={hex}
                    onChange={(e) => applyColor(e.target.value)}
                    className="w-32 h-32 rounded-2xl cursor-pointer border-4 border-border/60 shadow-lg"
                    style={{ padding: 0 }}
                  />
                </div>
                {cssName && (
                  <span className="text-xs font-medium text-muted-foreground bg-muted/50 border border-border/50 rounded-full px-3 py-1">
                    CSS name: <span className="text-foreground font-semibold">{cssName}</span>
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm font-medium">HEX Input</Label>
                <div className="flex gap-2">
                  <Input
                    value={hexInput}
                    onChange={(e) => { setHexInput(e.target.value); if (/^#?[0-9a-fA-F]{6}$/.test(e.target.value)) applyColor(e.target.value); }}
                    placeholder="#6366f1"
                    className="font-mono bg-background/60 border-border/60"
                  />
                  <div className="h-10 w-10 rounded-lg border border-border/60 shrink-0" style={{ backgroundColor: hex }} />
                </div>
              </div>

              {/* Formats */}
              <div className="space-y-2">
                {formats.map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/40 px-3 py-2">
                    <span className="text-[11px] font-bold text-muted-foreground w-10 shrink-0">{label}</span>
                    <code className="flex-1 font-mono text-sm text-foreground/80 truncate">{value}</code>
                    <button onClick={() => copy(value, label)} className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
            {/* Contrast checker */}
            <Card className="border-border/60 bg-card shadow-sm">
              <CardContent className="pt-5 pb-5 space-y-4">
                <h3 className="text-sm font-semibold">Contrast Checker</h3>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Compare against color</Label>
                  <div className="flex gap-2 items-center">
                    <input id="contrast-color" name="contrast-color" type="color" value={contrastHex} onChange={(e) => setContrastHex(e.target.value)} className="h-9 w-12 rounded-md border border-border/60 cursor-pointer p-0.5" />
                    <Input id="contrast-hex" name="contrast-hex" value={contrastHex} onChange={(e) => setContrastHex(e.target.value)} className="font-mono text-sm bg-background/60 border-border/60 h-9" />
                  </div>
                </div>
                {contrastResult && (
                  <div className="space-y-3">
                    <div className="rounded-xl border border-border/50 p-3 text-center" style={{ backgroundColor: hex, color: contrastHex }}>
                      <span className="text-sm font-medium">Sample Text Preview</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Contrast Ratio</span>
                      <span className="font-bold font-mono">{contrastResult.ratio}:1</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { label: "AA Normal", pass: contrastResult.aa },
                        { label: "AAA Normal", pass: contrastResult.aaa },
                        { label: "AA Large", pass: contrastResult.aaLarge },
                        { label: "AAA Large", pass: contrastResult.aaaLarge },
                      ].map(({ label, pass }) => (
                        <div key={label} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 border ${pass ? "bg-green-500/10 border-green-500/30 text-green-600" : "bg-destructive/10 border-destructive/30 text-destructive"}`}>
                          {pass ? <CheckCircle2 className="h-3 w-3 shrink-0" /> : <XCircle className="h-3 w-3 shrink-0" />}
                          <span className="font-medium">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent colors */}
            {recentColors.length > 0 && (
              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Recent Colors</p>
                  <div className="flex flex-wrap gap-2">
                    {recentColors.map((c) => (
                      <button key={c} onClick={() => applyColor(c)} title={c} className="h-7 w-7 rounded-lg border-2 border-border/60 hover:border-primary/60 transition-all hover:scale-110" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Palettes */}
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="pt-5 pb-5">
            <h3 className="text-sm font-semibold mb-4">Popular Palettes</h3>
            <div className="space-y-3">
              {PALETTES.map(({ name, colors }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16 shrink-0">{name}</span>
                  <div className="flex gap-1.5">
                    {colors.map((c) => (
                      <button key={c} onClick={() => applyColor(c)} title={c} className="h-7 w-10 rounded-md border border-border/40 hover:border-primary/60 transition-all hover:scale-105 hover:shadow-sm" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This color picker lets you select any color and instantly see its equivalent in HEX, RGB, HSL, and RGBA formats — copy any format with a single click. The built-in contrast checker shows WCAG AA and AAA compliance for text accessibility, helping designers ensure their color choices meet accessibility standards.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Finding the exact HEX value from a design screenshot or brand guide</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Checking if a text/background color combination meets WCAG accessibility standards</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Exploring color palettes and converting between CSS color formats</li>
          </ul>
        </div>
      </div>

      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}

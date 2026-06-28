import { useState, useCallback, useMemo } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { AdSlot } from "@/components/AdSlot";
import { Copy, Plus, Trash2, Layers } from "lucide-react";

interface ShadowLayer {
  id: number;
  h: number;
  v: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)})`;
}

function shadowToCSS(layer: ShadowLayer): string {
  const inset = layer.inset ? "inset " : "";
  const color = hexToRgba(layer.color, layer.opacity);
  return `${inset}${layer.h}px ${layer.v}px ${layer.blur}px ${layer.spread}px ${color}`;
}

let layerIdCounter = 2;

const DEFAULT_LAYERS: ShadowLayer[] = [
  { id: 1, h: 0, v: 4, blur: 16, spread: -2, color: "#000000", opacity: 20, inset: false },
];

const faqs = [
  { q: "What does the 'inset' option do?", a: "By default, box shadows appear outside the element (outset). Adding the inset keyword flips the shadow to the inside of the element, creating a 'pressed' or 'sunken' visual effect. Inset shadows are often used for inputs and buttons to indicate focus or active states." },
  { q: "Why are my box shadows not showing on transparent elements?", a: "Box shadows follow the element's border-box. If the element has no visible background and is transparent, the shadow is still rendered around the outer edge but may appear cut off depending on parent overflow settings. Make sure the parent does not have overflow: hidden set." },
  { q: "Can I use multiple box shadows?", a: "Yes! CSS supports layering multiple box shadows by separating them with commas. This generator supports up to 4 layers. Layered shadows create more realistic, natural-looking depth effects compared to a single flat shadow." },
  { q: "What is the spread radius?", a: "The spread radius expands or contracts the shadow beyond what the blur alone would produce. A positive spread makes the shadow larger than the element; a negative spread shrinks it. Setting spread to 0 keeps the shadow the same size as the element before blur is applied." },
  { q: "What does RGBA mean in the generated CSS?", a: "RGBA stands for Red, Green, Blue, Alpha. The alpha channel (the last value, 0–1) controls the transparency of the shadow. This generator converts your color and opacity settings into RGBA format, giving you smooth, semi-transparent shadows that blend naturally with any background." },
];

const relatedTools = [
  { title: "CSS Gradient Generator", href: "/tools/css-gradient-generator", description: "Build CSS gradients visually with live preview." },
  { title: "Color Picker", href: "/tools/color-picker", description: "Pick and convert colors between HEX, RGB, and HSL." },
  { title: "CSS Minifier", href: "/tools/css-minifier", description: "Minify and compress CSS files instantly." },
];

export default function CssBoxShadowGenerator() {
  useToolView("css-box-shadow-generator");
  const { toast } = useToast();

  const [layers, setLayers] = useState<ShadowLayer[]>(DEFAULT_LAYERS);
  const [copied, setCopied] = useState(false);

  const cssValue = useMemo(
    () => layers.map(shadowToCSS).join(",\n     "),
    [layers]
  );

  const cssOutput = `box-shadow: ${cssValue};`;

  const addLayer = useCallback(() => {
    if (layers.length >= 4) return;
    layerIdCounter += 1;
    setLayers((prev) => [
      ...prev,
      { id: layerIdCounter, h: 4, v: 4, blur: 8, spread: 0, color: "#000000", opacity: 15, inset: false },
    ]);
  }, [layers.length]);

  const removeLayer = useCallback((id: number) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const updateLayer = useCallback(<K extends keyof ShadowLayer>(id: number, field: K, value: ShadowLayer[K]) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    toast({ title: "Copied!", description: "CSS copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  }, [cssOutput, toast]);

  return (
    <MiniToolLayout
      seoTitle="CSS Box Shadow Generator — Free Online Shadow Builder | X Toolkit"
      seoDescription="Generate CSS box-shadow code visually. Adjust horizontal offset, vertical offset, blur, spread, color, and opacity. Supports inset and layered shadows. Copy the CSS instantly. Free."
      seoKeywords="css box shadow generator, box shadow tool, css shadow builder, box-shadow css, inset shadow generator, layered shadow css, shadow code generator"
      icon={Layers}
      title="CSS Box Shadow Generator"
      description="Build CSS box shadows visually with live preview. Control offset, blur, spread, color, and opacity. Supports multiple layers and inset shadows."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />

      <div className="space-y-6">
        {/* Live Preview */}
        <div className="rounded-xl border border-border/60 bg-muted/30 p-6 flex items-center justify-center min-h-[160px]">
          <div
            className="w-48 h-24 rounded-xl bg-white dark:bg-card border border-border/40 transition-all duration-200"
            style={{ boxShadow: cssValue }}
          />
        </div>

        {/* Shadow Layers */}
        <div className="space-y-4">
          {layers.map((layer, idx) => (
            <Card key={layer.id} className="border-border/60 bg-card shadow-sm">
              <CardContent className="pt-5 pb-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">Layer {idx + 1}</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`inset-${layer.id}`}
                        checked={layer.inset}
                        onCheckedChange={(v) => updateLayer(layer.id, "inset", !!v)}
                      />
                      <Label htmlFor={`inset-${layer.id}`} className="text-xs cursor-pointer">Inset</Label>
                    </div>
                    {layers.length > 1 && (
                      <button
                        onClick={() => removeLayer(layer.id)}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Remove layer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* H Offset */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Horizontal Offset</Label>
                      <span className="text-xs font-mono font-semibold">{layer.h}px</span>
                    </div>
                    <Slider
                      min={-50} max={50} step={1}
                      value={[layer.h]}
                      onValueChange={([v]) => updateLayer(layer.id, "h", v)}
                    />
                  </div>
                  {/* V Offset */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Vertical Offset</Label>
                      <span className="text-xs font-mono font-semibold">{layer.v}px</span>
                    </div>
                    <Slider
                      min={-50} max={50} step={1}
                      value={[layer.v]}
                      onValueChange={([v]) => updateLayer(layer.id, "v", v)}
                    />
                  </div>
                  {/* Blur */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Blur Radius</Label>
                      <span className="text-xs font-mono font-semibold">{layer.blur}px</span>
                    </div>
                    <Slider
                      min={0} max={100} step={1}
                      value={[layer.blur]}
                      onValueChange={([v]) => updateLayer(layer.id, "blur", v)}
                    />
                  </div>
                  {/* Spread */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Spread Radius</Label>
                      <span className="text-xs font-mono font-semibold">{layer.spread}px</span>
                    </div>
                    <Slider
                      min={-50} max={50} step={1}
                      value={[layer.spread]}
                      onValueChange={([v]) => updateLayer(layer.id, "spread", v)}
                    />
                  </div>
                </div>

                {/* Color + Opacity */}
                <div className="flex items-end gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Color</Label>
                    <input
                      type="color"
                      value={layer.color}
                      onChange={(e) => updateLayer(layer.id, "color", e.target.value)}
                      className="h-9 w-14 cursor-pointer rounded border border-border/60 bg-transparent p-0.5"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">Opacity</Label>
                      <span className="text-xs font-mono font-semibold">{layer.opacity}%</span>
                    </div>
                    <Slider
                      min={0} max={100} step={1}
                      value={[layer.opacity]}
                      onValueChange={([v]) => updateLayer(layer.id, "opacity", v)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {layers.length < 4 && (
            <Button variant="outline" onClick={addLayer} className="w-full border-dashed border-border/60">
              <Plus className="h-4 w-4 mr-2" /> Add Shadow Layer
            </Button>
          )}
        </div>

        {/* CSS Output */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Generated CSS</Label>
          <Textarea
            readOnly
            value={cssOutput}
            rows={4}
            className="font-mono text-sm resize-none bg-muted/30"
          />
          <Button onClick={handleCopy} className="w-full shadow-sm shadow-primary/20">
            <Copy className="h-4 w-4 mr-2" />
            {copied ? "Copied!" : "Copy CSS"}
          </Button>
        </div>
      </div>

      {/* Extended content */}
      <div className="space-y-6 pt-4">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Understanding CSS Box Shadows</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The CSS <code className="text-xs bg-muted px-1 rounded">box-shadow</code> property is one of the most powerful tools in a web designer's toolkit. It adds shadow effects around an element's frame, giving it a sense of depth and elevation. Unlike older techniques that used background images to fake depth, CSS box shadows are dynamic, resolution-independent, and update automatically when the element's size changes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Box shadows are widely used in modern UI design systems to communicate elevation levels. Google's Material Design specification, for example, defines a hierarchy of shadow intensities to convey how "high" above the surface a component is. Cards, dialogs, tooltips, and floating buttons all use different shadow values to indicate their relative elevation in the UI stack.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Box Shadow Syntax Breakdown</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The full <code className="text-xs bg-muted px-1 rounded">box-shadow</code> syntax is: <code className="text-xs bg-muted px-1 rounded">box-shadow: [inset] offset-x offset-y [blur-radius] [spread-radius] color</code>. All values after offset-y are optional and default to 0 (except color, which defaults to the element's foreground color).
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">offset-x:</strong> Horizontal offset. Positive moves shadow right, negative moves it left.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">offset-y:</strong> Vertical offset. Positive moves shadow down, negative moves it up.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">blur-radius:</strong> Higher values produce a more blurred, diffused shadow edge. 0 = sharp edges.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">spread-radius:</strong> Expands (positive) or contracts (negative) the shadow size before blur is applied.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">color:</strong> The shadow color. Using RGBA allows transparency for natural blending.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Inset vs Outset Shadows</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By default, box shadows appear outside the element's border-box — this is called an outset shadow. When you add the <code className="text-xs bg-muted px-1 rounded">inset</code> keyword, the shadow is rendered inside the element's padding area instead, making it appear as if the element is recessed or pressed into the page.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Inset shadows are particularly useful for: input fields to indicate focus state, buttons to show the pressed/active state, and inner border effects that don't affect layout. You can combine inset and outset shadows on the same element by separating them with commas, creating complex depth effects like neumorphic UI components.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Creating Layered Shadows for Depth</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Single-layer shadows often look flat and artificial. Using two or three carefully designed shadow layers creates much more realistic depth effects. A common technique is to combine a close, sharp shadow (small offset, low blur) with a distant, diffused shadow (larger offset, high blur). Each layer contributes to a different "frequency" of the shadow, mimicking how real-world light creates penumbra and umbra regions.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For example, a card component might use: a tight 2px/4px shadow at 15% opacity for the immediate contact shadow, plus a broader 8px/24px shadow at 10% opacity for the ambient shadow. Together these produce a convincing elevated card that looks natural in both light and dark themes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The spread radius is particularly useful when layering — a slightly negative spread on the outer shadow can prevent it from extending too far beyond the element's edges, keeping the effect clean and contained.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Box Shadow for Design Systems</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In design systems, shadows are typically defined as design tokens — named variables that represent specific elevation levels. Instead of hardcoding shadow values throughout a codebase, you define a scale (e.g., shadow-sm, shadow-md, shadow-lg, shadow-xl) as CSS custom properties or Tailwind utility classes. Every component that needs elevation picks from this predefined scale.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This approach ensures visual consistency, makes it easy to adjust shadows globally (dark mode adjustments, for example), and eliminates the maintenance burden of tracking down individual shadow values across hundreds of components. Use this generator to design your token values, then incorporate them into your CSS variables or Tailwind config.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For dark mode specifically, consider making your shadows more transparent or shifting them toward a colored tint that matches your background. Pure black shadows on dark backgrounds often look too heavy — a dark purple or dark blue shadow (matching your brand color) tends to look more polished.
          </p>
        </div>
      </div>

      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}

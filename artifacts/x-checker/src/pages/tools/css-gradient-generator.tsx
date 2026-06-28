import { useState, useCallback, useMemo } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { AdSlot } from "@/components/AdSlot";
import { Copy, Plus, Trash2, Layers } from "lucide-react";

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

const LINEAR_DIRECTIONS = [
  { value: "to right", label: "→ To Right" },
  { value: "to left", label: "← To Left" },
  { value: "to bottom", label: "↓ To Bottom" },
  { value: "to top", label: "↑ To Top" },
  { value: "to bottom right", label: "↘ To Bottom Right" },
  { value: "to bottom left", label: "↙ To Bottom Left" },
  { value: "to top right", label: "↗ To Top Right" },
  { value: "to top left", label: "↖ To Top Left" },
];

const RADIAL_SHAPES = ["ellipse", "circle"];
const RADIAL_POSITIONS = ["center", "top", "bottom", "left", "right", "top left", "top right", "bottom left", "bottom right"];

let idCounter = 3;

const faqs = [
  { q: "What is a CSS gradient?", a: "A CSS gradient is a smooth transition between two or more colors defined entirely in CSS without the need for image files. Gradients can be linear (transitioning along a straight line) or radial (radiating from a central point). They are applied using the background or background-image property." },
  { q: "What is the difference between linear and radial gradients?", a: "A linear gradient transitions colors along a straight line in a specified direction (e.g., left to right, top to bottom, or at any angle). A radial gradient radiates colors outward from a central point in a circular or elliptical shape." },
  { q: "How many color stops can I use?", a: "This generator supports 2 to 6 color stops. In raw CSS there is no hard limit — you can add as many stops as needed. However, more than 6–8 stops often produces diminishing visual returns and can make the gradient harder to manage." },
  { q: "What does the color stop position percentage mean?", a: "The position percentage defines where along the gradient that color is at full strength. A stop at 0% is at the start, 50% is the midpoint, and 100% is the end. Stops between 0% and 100% control how quickly or gradually colors blend." },
  { q: "Is this CSS gradient compatible with all browsers?", a: "CSS gradients using linear-gradient() and radial-gradient() are supported in all modern browsers including Chrome, Firefox, Safari, Edge, and Opera. Support has been universal since around 2012. No vendor prefixes are needed for modern websites." },
];

const relatedTools = [
  { title: "CSS Box Shadow Generator", href: "/tools/css-box-shadow-generator", description: "Build CSS box shadows visually with live preview." },
  { title: "Color Picker", href: "/tools/color-picker", description: "Pick and convert colors between HEX, RGB, and HSL." },
  { title: "CSS Minifier", href: "/tools/css-minifier", description: "Minify CSS files to reduce file size." },
];

export default function CssGradientGenerator() {
  useToolView("css-gradient-generator");
  const { toast } = useToast();

  const [gradientType, setGradientType] = useState<"linear" | "radial">("linear");
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { id: 1, color: "#6366f1", position: 0 },
    { id: 2, color: "#ec4899", position: 100 },
  ]);
  const [direction, setDirection] = useState("to right");
  const [customAngle, setCustomAngle] = useState<number | "">("");
  const [radialShape, setRadialShape] = useState("ellipse");
  const [radialPosition, setRadialPosition] = useState("center");
  const [copied, setCopied] = useState(false);

  const gradientValue = useMemo(() => {
    const stops = colorStops
      .slice()
      .sort((a, b) => a.position - b.position)
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");

    if (gradientType === "linear") {
      const dir = customAngle !== "" ? `${customAngle}deg` : direction;
      return `linear-gradient(${dir}, ${stops})`;
    } else {
      return `radial-gradient(${radialShape} at ${radialPosition}, ${stops})`;
    }
  }, [gradientType, colorStops, direction, customAngle, radialShape, radialPosition]);

  const cssOutput = `background: ${gradientValue};`;

  const addStop = useCallback(() => {
    if (colorStops.length >= 6) return;
    idCounter += 1;
    setColorStops((prev) => [
      ...prev,
      { id: idCounter, color: "#a855f7", position: 50 },
    ]);
  }, [colorStops.length]);

  const removeStop = useCallback((id: number) => {
    setColorStops((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateStop = useCallback((id: number, field: "color" | "position", value: string | number) => {
    setColorStops((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    toast({ title: "Copied!", description: "CSS copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  }, [cssOutput, toast]);

  return (
    <MiniToolLayout
      seoTitle="CSS Gradient Generator — Free Online Linear & Radial Gradient Builder | X Toolkit"
      seoDescription="Create beautiful CSS gradients visually. Build linear or radial gradients with custom color stops, directions, and positions. Copy the CSS with one click. Free, no signup."
      seoKeywords="css gradient generator, linear gradient generator, radial gradient css, css gradient maker, gradient color picker, css background gradient, gradient code generator"
      icon={Layers}
      title="CSS Gradient Generator"
      description="Build linear and radial CSS gradients visually with live preview. Add color stops, set direction, and copy the CSS output instantly."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />

      <div className="space-y-6">
        {/* Gradient Type Toggle */}
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="flex gap-2">
              <Button
                variant={gradientType === "linear" ? "default" : "outline"}
                onClick={() => setGradientType("linear")}
                className="flex-1"
              >
                Linear
              </Button>
              <Button
                variant={gradientType === "radial" ? "default" : "outline"}
                onClick={() => setGradientType("radial")}
                className="flex-1"
              >
                Radial
              </Button>
            </div>

            {/* Direction / Shape settings */}
            {gradientType === "linear" ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Direction</Label>
                  <Select
                    value={customAngle !== "" ? "custom" : direction}
                    onValueChange={(v) => {
                      if (v === "custom") return;
                      setCustomAngle("");
                      setDirection(v);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select direction" />
                    </SelectTrigger>
                    <SelectContent>
                      {LINEAR_DIRECTIONS.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Custom Angle (deg)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={360}
                    placeholder="e.g. 135"
                    value={customAngle}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCustomAngle(v === "" ? "" : Number(v));
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Shape</Label>
                  <Select value={radialShape} onValueChange={setRadialShape}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RADIAL_SHAPES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Position</Label>
                  <Select value={radialPosition} onValueChange={setRadialPosition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RADIAL_POSITIONS.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.charAt(0).toUpperCase() + p.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Color stops */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Color Stops ({colorStops.length})</Label>
                {colorStops.length < 6 && (
                  <Button variant="outline" size="sm" onClick={addStop} className="text-xs border-border/60">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Stop
                  </Button>
                )}
              </div>
              {colorStops.map((stop, i) => (
                <div key={stop.id} className="flex items-center gap-3 rounded-lg border border-border/50 bg-background/50 px-3 py-3">
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                    className="h-9 w-9 cursor-pointer rounded border border-border/60 bg-transparent p-0.5"
                    title="Pick color"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Stop {i + 1}</span>
                      <span>{stop.position}%</span>
                    </div>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[stop.position]}
                      onValueChange={([v]) => updateStop(stop.id, "position", v)}
                    />
                  </div>
                  {colorStops.length > 2 && (
                    <button
                      onClick={() => removeStop(stop.id)}
                      className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Remove stop"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Live Preview */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Live Preview</Label>
          <div
            className="w-full h-28 rounded-xl border border-border/60 shadow-sm"
            style={{ background: gradientValue }}
          />
        </div>

        {/* CSS Output */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Generated CSS</Label>
          <Textarea
            readOnly
            value={cssOutput}
            rows={3}
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
          <h2 className="text-lg font-semibold">What is a CSS Gradient?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A CSS gradient is a type of image that transitions smoothly between two or more colors, defined entirely using CSS without any image files. Gradients were introduced to replace simple background images and give designers the ability to create rich, colorful backgrounds that scale perfectly at any resolution. Because they are generated by the browser's rendering engine, CSS gradients are sharp on retina displays, load instantly, and can be easily modified with a few keystrokes.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Gradients are applied using the <code className="text-xs bg-muted px-1 rounded">background</code> or <code className="text-xs bg-muted px-1 rounded">background-image</code> CSS property. Unlike a solid color, a gradient is treated as an image value, which means you can layer multiple gradients over each other using comma-separated values in the same property. This technique is commonly used for adding subtle texture overlays or multi-directional color effects.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Linear vs Radial Gradients</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground/80">Linear gradients</strong> transition colors along a straight line from one point to another. You define the direction either by specifying a keyword like <code className="text-xs bg-muted px-1 rounded">to right</code> or an angle in degrees. A 0deg gradient goes from bottom to top, while 90deg goes from left to right. The most common use cases are horizontal page headers, hero sections, and button hover effects.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground/80">Radial gradients</strong> radiate outward from a center point in a circular or elliptical shape. They are great for spotlight effects, glowing elements, circular badges, and backgrounds that feel "focused" at a certain point. You can specify whether the shape is a circle or an ellipse, and where the center point is positioned within the element. This gives you considerable creative control compared to the fixed directionality of linear gradients.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Choosing between the two comes down to your design intent. Linear gradients feel more directional and energetic; radial gradients feel more centered and ambient. Both can be combined in the same element by stacking multiple gradient values.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">CSS Gradient Syntax Explained</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The basic syntax for a linear gradient is: <code className="text-xs bg-muted px-1 rounded">linear-gradient(direction, color-stop1, color-stop2, ...)</code>. The direction can be a keyword (<code className="text-xs bg-muted px-1 rounded">to right</code>, <code className="text-xs bg-muted px-1 rounded">to bottom left</code>) or an angle (<code className="text-xs bg-muted px-1 rounded">135deg</code>). When no direction is specified, the default is <code className="text-xs bg-muted px-1 rounded">to bottom</code> (top to bottom).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For radial gradients, the syntax is: <code className="text-xs bg-muted px-1 rounded">radial-gradient(shape size at position, color-stop1, color-stop2, ...)</code>. The shape can be <code className="text-xs bg-muted px-1 rounded">circle</code> or <code className="text-xs bg-muted px-1 rounded">ellipse</code>. The size can be <code className="text-xs bg-muted px-1 rounded">closest-side</code>, <code className="text-xs bg-muted px-1 rounded">farthest-corner</code>, or explicit dimensions. The position works like the <code className="text-xs bg-muted px-1 rounded">background-position</code> property.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Colors can be specified in any valid CSS color format: hex codes, RGB, RGBA (with transparency), HSL, named colors, or even CSS custom properties (variables). This generator uses hex colors for maximum compatibility.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Color Stops and Positions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Color stops define where specific colors appear within the gradient. Each stop has a color value and an optional position. Without explicit positions, the browser distributes stops evenly. For example, three stops with no positions become 0%, 50%, and 100% automatically.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When you set explicit positions, you gain fine-grained control over how colors blend. Setting two adjacent stops to the same position creates a hard color transition (no blending at all) — a technique used for striped backgrounds. Placing stops close together creates a rapid color change, while widely spaced stops produce a long, smooth transition.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You can also use length units instead of percentages (e.g., <code className="text-xs bg-muted px-1 rounded">20px</code>, <code className="text-xs bg-muted px-1 rounded">2rem</code>), which is useful when you need a gradient to change at an absolute point regardless of the element's size.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Browser Support</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The <code className="text-xs bg-muted px-1 rounded">linear-gradient()</code> and <code className="text-xs bg-muted px-1 rounded">radial-gradient()</code> functions have been supported in all major browsers without vendor prefixes since approximately 2013. As of 2026, global browser support is effectively 99%+ for standard gradient syntax. You no longer need <code className="text-xs bg-muted px-1 rounded">-webkit-</code>, <code className="text-xs bg-muted px-1 rounded">-moz-</code>, or <code className="text-xs bg-muted px-1 rounded">-ms-</code> prefixes unless you are specifically targeting very old browsers (Internet Explorer 9 or earlier, Safari 5 or earlier).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Newer gradient types like <code className="text-xs bg-muted px-1 rounded">conic-gradient()</code> have slightly lower coverage but are supported in all modern browsers released after 2020. For the vast majority of production websites, the CSS output from this generator is safe to use without any compatibility fallbacks.
          </p>
        </div>
      </div>

      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}

import { useState, useCallback, useRef } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ImageIcon, Download, Loader2, UploadCloud } from "lucide-react";

// ─── Canvas resize helper ────────────────────────────────────────────────────

function resizeImage(
  file: File,
  width: number,
  height: number,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Failed to create blob"));
        },
        `image/${format}`,
        quality / 100
      );
    };
    img.onerror = reject;
    img.src = url;
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const faqs = [
  { q: "Is my image uploaded anywhere?", a: "No. This tool is 100% browser-based. Your image is processed entirely on your device using the HTML5 Canvas API. No data is sent to any server. You can use it offline once the page is loaded." },
  { q: "Why does the file size change when I resize?", a: "File size depends on three factors: pixel dimensions, the output format, and the quality setting. Reducing dimensions directly reduces the number of pixels that need to be stored. Choosing a more efficient format (like WebP instead of PNG) or lowering the quality setting for JPEG/WebP further reduces file size." },
  { q: "What is the best format for web images?", a: "WebP is generally the best format for web use in 2026 — it offers both lossy and lossless compression with smaller file sizes than JPEG and PNG respectively, and is supported in all modern browsers. Use JPEG for photographs where some quality loss is acceptable, and PNG for images that require transparency or exact pixel reproduction." },
  { q: "Why is the quality slider disabled for PNG?", a: "PNG is a lossless format — it preserves every pixel perfectly without any quality degradation. There is no quality setting to adjust. If you need to reduce a PNG's file size, reduce its dimensions or switch to a lossy format like WebP or JPEG." },
  { q: "Why does my image look blurry after resizing?", a: "Scaling an image down is generally fine. Scaling it UP (enlarging beyond its original dimensions) will cause blurriness because the browser has to interpolate pixels that do not exist in the original. For best results, start with an image at or above the resolution you need." },
];

const relatedTools = [
  { title: "Image Compressor", href: "/tools/image-compressor", description: "Compress JPEG and PNG images in your browser." },
  { title: "QR Code Generator", href: "/tools/qr-code-generator", description: "Generate QR codes from any URL or text." },
  { title: "Color Picker", href: "/tools/color-picker", description: "Pick and convert colors from any image." },
];

export default function ImageResizer() {
  useToolView("image-resizer");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockAspect, setLockAspect] = useState(true);
  const [quality, setQuality] = useState(85);
  const [format, setFormat] = useState("jpeg");

  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedW, setResizedW] = useState(0);
  const [resizedH, setResizedH] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadFile = useCallback((f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast({ title: "Unsupported format", description: "Please upload a JPEG, PNG, WebP, or GIF image.", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setOrigW(img.naturalWidth);
      setOrigH(img.naturalHeight);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setFile(f);
      setPreview(url);
      setResizedBlob(null);
    };
    img.src = url;
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const handleWidthChange = useCallback((val: string) => {
    const w = Number(val);
    if (isNaN(w) || w <= 0) return;
    setWidth(w);
    if (lockAspect && origW > 0) {
      setHeight(Math.round((w / origW) * origH));
    }
  }, [lockAspect, origW, origH]);

  const handleHeightChange = useCallback((val: string) => {
    const h = Number(val);
    if (isNaN(h) || h <= 0) return;
    setHeight(h);
    if (lockAspect && origH > 0) {
      setWidth(Math.round((h / origH) * origW));
    }
  }, [lockAspect, origW, origH]);

  const handleResize = useCallback(async () => {
    if (!file || width <= 0 || height <= 0) return;
    setLoading(true);
    try {
      const blob = await resizeImage(file, width, height, format, quality);
      setResizedBlob(blob);
      setResizedW(width);
      setResizedH(height);
    } catch {
      toast({ title: "Error", description: "Failed to resize the image.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [file, width, height, format, quality, toast]);

  const handleDownload = useCallback(() => {
    if (!resizedBlob) return;
    const ext = format === "jpeg" ? "jpg" : format;
    const url = URL.createObjectURL(resizedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resized-image.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [resizedBlob, format]);

  const showQuality = format !== "png";

  return (
    <MiniToolLayout
      seoTitle="Image Resizer — Free Online Image Resize Tool | X Toolkit"
      seoDescription="Resize images online for free. Upload JPEG, PNG, or WebP images, set custom width and height, lock aspect ratio, choose quality and format, then download instantly. 100% browser-based — nothing uploaded."
      seoKeywords="image resizer, resize image online, image resize tool, compress image size, change image dimensions, resize jpg online, resize png, image size reducer, free image resizer"
      icon={ImageIcon}
      title="Image Resizer"
      description="Resize JPEG, PNG, and WebP images in your browser. Set custom dimensions, lock aspect ratio, choose quality and format, then download. No uploads — 100% private."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />

      <div className="space-y-6">
        {/* Drop zone */}
        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer py-12 px-6 gap-3 transition-colors ${dragging ? "border-primary bg-primary/5" : "border-border/60 hover:border-primary/50 hover:bg-muted/30"}`}
          >
            <UploadCloud className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground text-center">
              <span className="text-foreground font-medium">Click to upload</span> or drag & drop an image here
            </p>
            <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, GIF supported</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileInput}
            />
          </div>
        )}

        {/* Image loaded state */}
        {file && preview && (
          <>
            <Card className="border-border/60 bg-card shadow-sm">
              <CardContent className="pt-5 pb-5 space-y-4">
                {/* Preview + info */}
                <div className="flex gap-4 items-start">
                  <img
                    src={preview}
                    alt="Original"
                    className="w-24 h-24 rounded-lg object-contain border border-border/60 bg-muted/30 shrink-0"
                  />
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">Original: {origW} × {origH} px</p>
                    <p className="text-xs text-muted-foreground">File size: {formatBytes(file.size)}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs border-border/60 mt-1"
                      onClick={() => { setFile(null); setPreview(null); setResizedBlob(null); }}
                    >
                      Change image
                    </Button>
                  </div>
                </div>

                {/* Dimension inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Width (px)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={width}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Height (px)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={height}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="lock-aspect"
                    checked={lockAspect}
                    onCheckedChange={(v) => setLockAspect(!!v)}
                  />
                  <Label htmlFor="lock-aspect" className="text-sm cursor-pointer">Lock aspect ratio</Label>
                </div>

                {/* Format selector */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Output Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jpeg">JPEG</SelectItem>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="webp">WebP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quality slider — only for JPEG and WebP */}
                {showQuality && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Quality</Label>
                      <span className="text-sm font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{quality}%</span>
                    </div>
                    <Slider
                      min={10}
                      max={100}
                      step={1}
                      value={[quality]}
                      onValueChange={([v]) => setQuality(v)}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Smaller file</span>
                      <span>Best quality</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleResize}
                  disabled={loading}
                  className="w-full shadow-sm shadow-primary/20"
                >
                  {loading ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Resizing...</>
                  ) : (
                    <><ImageIcon className="h-4 w-4 mr-2" /> Resize Image</>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Resize result */}
            {resizedBlob && (
              <div className="rounded-xl border border-border/60 bg-card/60 p-5 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold">Resized successfully</p>
                    <p className="text-xs text-muted-foreground">{resizedW} × {resizedH} px · {formatBytes(resizedBlob.size)}</p>
                  </div>
                  <Button onClick={handleDownload} className="shadow-sm shadow-primary/20">
                    <Download className="h-4 w-4 mr-2" /> Download
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Extended content */}
      <div className="space-y-6 pt-4">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">How Browser-Based Image Resizing Works</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This tool resizes images entirely in your browser using the HTML5 Canvas API. When you upload an image, it is loaded into an <code className="text-xs bg-muted px-1 rounded">Image</code> element using a temporary object URL. A canvas element is then created at your specified target dimensions, and the image is drawn onto it using <code className="text-xs bg-muted px-1 rounded">drawImage()</code>. Finally, the canvas content is exported to a blob using <code className="text-xs bg-muted px-1 rounded">toBlob()</code> in the format and quality you selected.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Because everything happens in the browser, your images never leave your device. This is especially important for sensitive images — personal photos, confidential documents, or proprietary design files. There are no upload limits, no watermarks, and no accounts required.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Canvas API uses bilinear or bicubic interpolation for scaling, which produces smooth results for most photographic content. For pixel art or images that require exact pixel reproduction, PNG with no quality reduction is the correct output format.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">JPEG vs PNG vs WebP — Which Format to Choose?</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">JPEG:</strong> Best for photographs and complex, colorful images. Uses lossy compression that discards some visual data to achieve small file sizes. Quality settings let you balance size vs. sharpness. Does not support transparency.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">PNG:</strong> Best for images with transparency (logos, UI elements, icons), screenshots, and images with sharp edges or text. Uses lossless compression — no quality loss. Files are larger than JPEG for photographs.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">WebP:</strong> Google's modern format that outperforms both JPEG and PNG. Lossy WebP is 25–35% smaller than JPEG at equivalent quality. Lossless WebP is 26% smaller than PNG. Supports transparency. Supported in all modern browsers (Chrome, Firefox, Safari, Edge). The best default choice for web in 2026.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Understanding Image Quality Settings</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The quality slider applies to lossy formats (JPEG and WebP). It controls how aggressively the encoder compresses the image by discarding visual information. A quality of 100% preserves as much detail as the format allows; a quality of 50% produces noticeably smaller files at the cost of visible compression artifacts.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For most web use cases, a quality setting of 75–85% is the sweet spot — files are significantly smaller than 100% quality but the difference is imperceptible to most viewers at typical screen sizes. For thumbnail images displayed at small sizes, you can safely go as low as 60–70% without visible degradation.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For product photography, portfolio images, or any context where visual quality is critical, stay at 85–90%. For social media sharing or email attachments where file size matters, 70–80% is typically sufficient.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Aspect Ratio and Why It Matters</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The aspect ratio of an image is the proportional relationship between its width and height, typically expressed as W:H. Common aspect ratios are 16:9 (widescreen video and monitors), 4:3 (traditional TV and older monitors), 1:1 (square, used heavily on Instagram), and 3:2 (common in photography).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When you resize an image without maintaining its aspect ratio, the result is a distorted image — people look squished or stretched, circles become ovals, and logos become unrecognizable. The "Lock aspect ratio" option in this tool prevents this by automatically calculating the correct height when you change the width, and vice versa.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            There are legitimate cases for changing the aspect ratio — cropping to a specific social media format, or creating thumbnail images at fixed dimensions. In these cases, disable the lock and enter your target dimensions directly. For best results when changing aspect ratio, consider using a dedicated crop tool to choose which part of the image to keep.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Image Resizing for Web Performance</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Images are typically the largest assets on web pages and a primary source of performance problems. Google's Core Web Vitals metrics — especially Largest Contentful Paint (LCP) — are directly affected by image loading performance. Serving images at the correct size is one of the most impactful optimizations you can make.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A common mistake is uploading a 4000×3000 px photograph and using CSS to display it at 400×300 px. The browser downloads the full 3MB image and then scales it down in the rendering engine — wasting both bandwidth and browser resources. The correct approach is to resize the image to the largest size it will actually be displayed at before uploading it to your server.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For responsive websites, you may need multiple sizes of the same image: a small version for mobile (e.g., 480px wide), a medium version for tablets (e.g., 1024px wide), and a large version for desktop (e.g., 1920px wide). HTML's <code className="text-xs bg-muted px-1 rounded">srcset</code> attribute lets the browser automatically choose the right size for the device. Use this tool to generate each size in the scale.
          </p>
        </div>
      </div>

      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}

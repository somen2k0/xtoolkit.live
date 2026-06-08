import { useState, useCallback, useRef } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { AdSlot } from "@/components/AdSlot";
import { ImageIcon, Upload, Download, X, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface CompressedImage {
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  ratio: number;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// FIXED: Image Compressor - FileReader approach, PNG→JPEG conversion, per-file error reporting
async function compressImage(file: File, quality: number): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return reject(new Error(`Could not read: ${file.name}`));

      const img = new Image();
      img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context unavailable"));

        // Fill white background before drawing (needed for PNG→JPEG transparency)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // PNG and WebP → JPEG for quality-based compression
        // JPEG already supports quality parameter natively
        const outputMime = "image/jpeg";
        const qualityParam = Math.max(0.1, Math.min(1, quality / 100));

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error(`Compression failed: ${file.name}`));
            const ratio = Math.round((1 - blob.size / file.size) * 100);
            // Convert blob → data: URL so the preview is not blocked by CSP
            // (blob: URLs are blocked; data: URLs are already whitelisted)
            const blobReader = new FileReader();
            blobReader.onerror = () => reject(new Error(`Preview failed: ${file.name}`));
            blobReader.onload = (ev) => {
              const compressedUrl = ev.target?.result as string;
              resolve({
                name: file.name,
                originalSize: file.size,
                compressedSize: blob.size,
                originalUrl: dataUrl,
                compressedUrl,
                ratio,
              });
            };
            blobReader.readAsDataURL(blob);
          },
          outputMime,
          qualityParam,
        );
      };

      img.src = dataUrl;
    };

    reader.readAsDataURL(file);
  });
}

const faqs = [
  { q: "Does this upload my images to a server?", a: "No. All compression happens entirely in your browser using the Canvas API. Your images never leave your device." },
  { q: "What image formats are supported?", a: "JPEG, PNG, and WebP files are supported. For PNG files, the quality slider affects color reduction; for JPEG and WebP, it directly controls compression quality." },
  { q: "Why is my PNG not getting much smaller?", a: "PNG is a lossless format, so quality-based compression has less effect than on JPEG. For the best results with PNG, consider converting to JPEG or WebP if transparency isn't required." },
  { q: "How many images can I compress at once?", a: "Up to 5 images at a time. Each file is compressed independently and can be downloaded separately." },
];

const relatedTools = [
  { title: "OG Image Preview", href: "/tools/og-image-preview", description: "Preview how your image looks in social media cards." },
  { title: "Color Picker & Converter", href: "/tools/color-picker", description: "Pick colors and convert between HEX, RGB, HSL." },
  { title: "QR Code Generator", href: "/tools/qr-code-generator", description: "Generate QR codes and download as PNG." },
];

export default function ImageCompressor() {
  useToolView("image-compressor");
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [quality, setQuality] = useState(80);
  const [results, setResults] = useState<CompressedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);

  const processFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const valid = Array.from(files).filter((f) => /image\/(jpeg|png|webp)/.test(f.type)).slice(0, 5);
    if (!valid.length) {
      toast({ title: "Unsupported format", description: "Please upload JPEG, PNG, or WebP images.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResults([]);

    // Process each file individually so a single failure doesn't block others
    const compressed: CompressedImage[] = [];
    const failed: string[] = [];
    for (const f of valid) {
      try {
        compressed.push(await compressImage(f, quality));
      } catch (err) {
        failed.push(err instanceof Error ? err.message : f.name);
      }
    }

    setResults(compressed);
    setLoading(false);

    if (failed.length > 0) {
      toast({
        title: failed.length === valid.length ? "Compression failed" : "Some files failed",
        description: failed.join(" · "),
        variant: "destructive",
      });
    }
  }, [quality, toast]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const download = (img: CompressedImage) => {
    const a = document.createElement("a");
    a.href = img.compressedUrl;
    const ext = img.name.split(".").pop() ?? "jpg";
    a.download = img.name.replace(`.${ext}`, `_compressed.${ext}`);
    a.click();
  };

  return (
    <MiniToolLayout
      seoTitle="Image Compressor — Free Online Image Compression | X Toolkit"
      seoDescription="Compress JPEG, PNG, and WebP images for free online. Reduce file size without losing quality. Browser-based, private, no upload to server required."
      icon={ImageIcon}
      title="Image Compressor"
      description="Compress JPEG, PNG, and WebP images in your browser — private, no server upload."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />

      <div className="space-y-6">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="pt-6 space-y-5">
            {/* Quality */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Quality</Label>
                <span className="text-sm font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{quality}%</span>
              </div>
              <Slider min={10} max={100} step={5} value={[quality]} onValueChange={([v]) => setQuality(v)} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>10% (smallest)</span><span>100% (original)</span>
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-colors ${dragging ? "border-primary/60 bg-primary/5" : "border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border"}`}
            >
              <input ref={inputRef} id="image-file-upload" name="image-file-upload" type="file" accept=".jpg,.jpeg,.png,.webp" multiple className="hidden" onChange={(e) => processFiles(e.target.files)} />
              <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Drag & drop images here</p>
                <p className="text-xs text-muted-foreground mt-1">or click to browse — JPEG, PNG, WebP · max 5 files</p>
              </div>
            </div>

            {loading && (
              <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Compressing…</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {results.map((img, i) => (
              <Card key={i} className="border-border/60 bg-card shadow-sm overflow-hidden">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{img.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{formatBytes(img.originalSize)}</span>
                        <span className="text-primary font-medium">→</span>
                        <span className="font-medium text-foreground">{formatBytes(img.compressedSize)}</span>
                        <span className={`font-semibold ${img.ratio > 0 ? "text-green-500" : "text-muted-foreground"}`}>
                          {img.ratio > 0 ? `-${img.ratio}%` : "no change"}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => download(img)} className="shrink-0 text-xs shadow-sm shadow-primary/20">
                      <Download className="h-3.5 w-3.5 mr-1.5" /> Download
                    </Button>
                  </div>

                  {/* Before/after */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">Before</p>
                      <div className="rounded-lg overflow-hidden border border-border/50 bg-muted/20 aspect-video flex items-center justify-center">
                        <img src={img.originalUrl} alt="Original" className="max-h-full max-w-full object-contain" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">After</p>
                      <div className="rounded-lg overflow-hidden border border-border/50 bg-muted/20 aspect-video flex items-center justify-center">
                        <img src={img.compressedUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button variant="outline" onClick={() => { setResults([]); if (inputRef.current) inputRef.current.value = ""; }} className="text-xs border-border/60 w-full">
              <X className="h-3.5 w-3.5 mr-1.5" /> Clear & Start Over
            </Button>
          </div>
        )}

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This image compressor reduces file size using the browser's built-in Canvas API — no files are ever uploaded to a server. Your images remain completely private, processed entirely on your device.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Adjust the quality slider to find the right balance between file size and visual quality. The before/after preview lets you judge the result before downloading.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Optimizing images for faster website loading</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Reducing file size before uploading to social media or email</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Batch-compressing product or portfolio photos</li>
          </ul>
        </div>
      </div>

      {/* Extended content */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Why Image Compression Matters</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Images are typically the largest files on any webpage, often accounting for 50-80% of total page weight. Unoptimized images significantly slow down page load times — and page speed directly affects both user experience and search engine rankings.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">Google's Core Web Vitals include Largest Contentful Paint (LCP), which measures how long it takes for the main content of a page to become visible. Large uncompressed images are the most common cause of poor LCP scores. Compressing images before uploading them to your website is one of the most impactful optimizations available.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">Research consistently shows that users abandon websites that take more than 3 seconds to load. On mobile connections, this is even more critical. A single uncompressed photograph can be 5-10MB — compressing it to 300-500KB with negligible visual quality loss can reduce load time by several seconds.</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Lossy vs Lossless Compression</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">There are two fundamentally different approaches to image compression:</p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Lossless compression</strong> reduces file size without discarding any image data. The original image can be perfectly reconstructed from the compressed file. PNG uses lossless compression, making it ideal for images that require perfect accuracy like logos, icons, screenshots, and text-heavy images.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Lossy compression</strong> achieves much greater file size reductions by permanently discarding some image data — specifically data that is less perceptible to the human eye. JPEG uses lossy compression, making it ideal for photographs and complex images where minor quality loss at high compression ratios is acceptable and often imperceptible.</span></li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">Our compressor uses the browser's Canvas API to apply lossy compression to JPEG, PNG, and WebP files. PNG files are converted to JPEG format for compression since PNG's lossless format doesn't support quality settings. If you need to maintain transparency, keep PNG files at a lower compression ratio.</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Image Format Guide</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">JPEG:</strong> Best for photographs and complex images with gradients and many colors. Supports lossy compression with excellent results at 70-85% quality. Does not support transparency.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">PNG:</strong> Best for images requiring transparency, logos, icons, screenshots, and images with text. Uses lossless compression. File sizes are larger than JPEG for photographs but better for graphics.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">WebP:</strong> Google's modern format that supports both lossy and lossless compression with better results than JPEG and PNG. WebP files are typically 25-35% smaller than equivalent JPEG files. Supported by all modern browsers.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">SVG:</strong> Best for logos, icons, and illustrations that need to scale to any size without quality loss. Not a raster format — uses mathematical paths instead of pixels. Excellent for simple graphics but not suitable for photographs.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Image Optimization Best Practices</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Resize before compressing:</strong> Compression works on the actual pixel dimensions of the image. If you're displaying an image at 800px width but the file is 4000px wide, resize it to 800px first — this alone reduces file size by 96% before any compression.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Use appropriate quality settings:</strong> For photographs on the web, 70-85% quality produces excellent results with significant file size reduction. Going below 60% starts to produce visible artifacts. For images with text or logos, use higher quality (85-95%) to maintain sharpness.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Consider lazy loading:</strong> Images below the fold don't need to load immediately. Use the HTML loading='lazy' attribute to defer loading of off-screen images.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Use responsive images:</strong> Serve appropriately sized images for different screen sizes using the srcset attribute. Mobile users don't need 2000px wide images.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is my image data sent to any server?", a: "No. Our image compressor runs entirely in your browser using the Canvas API. Your images are never uploaded to or processed by any server. Complete privacy guaranteed." },
              { q: "What is the maximum file size I can compress?", a: "Our compressor handles files up to several hundred MB in theory, but browser memory limits practical use to files under 50MB. Most web images are well within this range." },
              { q: "Will compression make my images blurry?", a: "At quality settings of 70% and above, compression artifacts are generally imperceptible for photographs. The preview comparison lets you see the quality before downloading." },
              { q: "Can I compress PNG files?", a: "Yes. PNG files are compressed by converting them to JPEG format. If your PNG has a transparent background, the transparency will be filled with white. Use a quality of 85%+ for best results." },
              { q: "How much can images be compressed?", a: "Typical JPEG photographs compress 60-80% with minimal quality loss. Screenshots and graphics compress 40-60%. The actual ratio depends on image content and complexity." },
            ].map(({ q, a }) => (
              <div key={q} className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground/80">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}

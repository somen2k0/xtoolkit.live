import { useState, useRef, useCallback } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { AdSlot } from "@/components/AdSlot";
import { QRCodeCanvas } from "qrcode.react";
import { Download, QrCode } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type InputType = "url" | "text" | "email" | "phone" | "wifi";
type QRSize = "small" | "medium" | "large";
type ErrorLevel = "L" | "M" | "Q" | "H";
type WifiSecurity = "WPA" | "WEP" | "nopass";

const SIZE_MAP: Record<QRSize, number> = { small: 150, medium: 220, large: 300 };

const faqs = [
  { q: "What is a QR code?", a: "A QR (Quick Response) code is a 2D barcode that can be scanned by any smartphone camera to open a URL, contact, or other data instantly." },
  { q: "What does error correction level mean?", a: "Error correction allows a QR code to be read even if part of it is damaged. Level L = 7%, M = 15%, Q = 25%, H = 30% of data can be lost and the code still works. Higher levels make the code denser." },
  { q: "Can I use this for WiFi sharing?", a: "Yes — select 'WiFi' as the input type, enter your SSID, password, and security type. Anyone who scans the code will be automatically connected to your network." },
  { q: "Is the QR code saved anywhere?", a: "No. QR codes are generated entirely in your browser and never uploaded to any server." },
];

const relatedTools = [
  { title: "Password Generator", href: "/tools/password-generator", description: "Generate strong, secure random passwords." },
  { title: "URL Encoder & Decoder", href: "/tools/url-encoder", description: "Encode special characters in URLs instantly." },
  { title: "Color Picker & Converter", href: "/tools/color-picker", description: "Pick colors and convert between HEX, RGB, HSL." },
];

function buildQRValue(type: InputType, fields: Record<string, string>): string {
  switch (type) {
    case "url": return fields.url || "";
    case "text": return fields.text || "";
    case "email": return `mailto:${fields.email}${fields.subject ? `?subject=${encodeURIComponent(fields.subject)}` : ""}`;
    case "phone": return `tel:${fields.phone}`;
    case "wifi": return `WIFI:T:${fields.security || "WPA"};S:${fields.ssid};P:${fields.wifiPassword};;`;
    default: return "";
  }
}

export default function QrCodeGenerator() {
  useToolView("qr-code-generator");
  const { toast } = useToast();
  const canvasRef = useRef<HTMLDivElement>(null);

  const [inputType, setInputType] = useState<InputType>("url");
  const [fields, setFields] = useState<Record<string, string>>({ url: "https://xtoolkit.live", security: "WPA" });
  const [size, setSize] = useState<QRSize>("medium");
  const [fg, setFg] = useState("#000000");
  const [bg, setBg] = useState("#ffffff");
  const [level, setLevel] = useState<ErrorLevel>("M");

  const qrValue = buildQRValue(inputType, fields);
  const px = SIZE_MAP[size];

  const setField = (k: string, v: string) => setFields((p) => ({ ...p, [k]: v }));

  const download = useCallback(() => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast({ title: "Downloaded!", description: "QR code saved as PNG." });
  }, [toast]);

  return (
    <MiniToolLayout
      seoTitle="QR Code Generator — Free Online QR Creator | X Toolkit"
      seoDescription="Generate QR codes for URLs, text, email, phone numbers, and WiFi instantly. Free online QR code generator. No signup, download as PNG."
      icon={QrCode}
      title="QR Code Generator"
      description="Generate QR codes for URLs, text, email, phone, and WiFi. Download as PNG."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="pt-6 space-y-5">
              {/* Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Input Type</Label>
                <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
                  {(["url", "text", "email", "phone", "wifi"] as InputType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setInputType(t)}
                      className={`text-xs py-1.5 px-2 rounded-lg border transition-all font-medium capitalize ${inputType === t ? "bg-primary text-primary-foreground border-primary" : "border-border/60 hover:border-border text-muted-foreground hover:text-foreground bg-muted/30"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic fields */}
              {inputType === "url" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">URL</Label>
                  <Input id="qr-url" name="qr-url" value={fields.url ?? ""} onChange={(e) => setField("url", e.target.value)} placeholder="https://example.com" className="bg-background/60 border-border/60" />
                </div>
              )}
              {inputType === "text" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Text</Label>
                  <Input id="qr-text" name="qr-text" value={fields.text ?? ""} onChange={(e) => setField("text", e.target.value)} placeholder="Your text here" className="bg-background/60 border-border/60" />
                </div>
              )}
              {inputType === "email" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Email Address</Label>
                    <Input id="qr-email" name="qr-email" value={fields.email ?? ""} onChange={(e) => setField("email", e.target.value)} placeholder="name@example.com" className="bg-background/60 border-border/60" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Subject (optional)</Label>
                    <Input id="qr-subject" name="qr-subject" value={fields.subject ?? ""} onChange={(e) => setField("subject", e.target.value)} placeholder="Hello!" className="bg-background/60 border-border/60" />
                  </div>
                </div>
              )}
              {inputType === "phone" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <Input id="qr-phone" name="qr-phone" value={fields.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} placeholder="+1234567890" className="bg-background/60 border-border/60" />
                </div>
              )}
              {inputType === "wifi" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Network Name (SSID)</Label>
                    <Input id="qr-ssid" name="qr-ssid" value={fields.ssid ?? ""} onChange={(e) => setField("ssid", e.target.value)} placeholder="MyWiFiNetwork" className="bg-background/60 border-border/60" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Password</Label>
                    <Input id="qr-wifi-password" name="qr-wifi-password" value={fields.wifiPassword ?? ""} onChange={(e) => setField("wifiPassword", e.target.value)} placeholder="WiFi password" type="password" className="bg-background/60 border-border/60" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Security</Label>
                    <div className="flex gap-2">
                      {(["WPA", "WEP", "nopass"] as WifiSecurity[]).map((s) => (
                        <button key={s} onClick={() => setField("security", s)} className={`flex-1 text-xs py-1.5 px-2 rounded-lg border transition-all font-medium ${fields.security === s ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground bg-muted/30 hover:text-foreground"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Size */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Size</Label>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as QRSize[]).map((s) => (
                    <button key={s} onClick={() => setSize(s)} className={`flex-1 text-xs py-1.5 rounded-lg border transition-all font-medium capitalize ${size === s ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground bg-muted/30 hover:text-foreground"}`}>{s}</button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Foreground Color</Label>
                  <div className="flex items-center gap-2">
                    <input id="qr-fg-color" name="qr-fg-color" type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 w-12 rounded-md border border-border/60 bg-background/60 cursor-pointer p-0.5" />
                    <Input id="qr-fg-hex" name="qr-fg-hex" value={fg} onChange={(e) => setFg(e.target.value)} className="font-mono text-sm bg-background/60 border-border/60 h-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input id="qr-bg-color" name="qr-bg-color" type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-12 rounded-md border border-border/60 bg-background/60 cursor-pointer p-0.5" />
                    <Input id="qr-bg-hex" name="qr-bg-hex" value={bg} onChange={(e) => setBg(e.target.value)} className="font-mono text-sm bg-background/60 border-border/60 h-9" />
                  </div>
                </div>
              </div>

              {/* Error correction */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Error Correction Level</Label>
                <div className="flex gap-1.5">
                  {(["L", "M", "Q", "H"] as ErrorLevel[]).map((l) => (
                    <button key={l} onClick={() => setLevel(l)} className={`flex-1 text-xs py-1.5 rounded-lg border transition-all font-mono font-bold ${level === l ? "bg-primary text-primary-foreground border-primary" : "border-border/60 text-muted-foreground bg-muted/30 hover:text-foreground"}`}>{l}</button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">L=7% · M=15% · Q=25% · H=30% damage recovery</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
              <div ref={canvasRef} className="rounded-xl p-4 border border-border/40" style={{ backgroundColor: bg }}>
                {qrValue ? (
                  <QRCodeCanvas value={qrValue} size={px} fgColor={fg} bgColor={bg} level={level} includeMargin={false} />
                ) : (
                  <div className="flex items-center justify-center text-muted-foreground text-sm" style={{ width: px, height: px }}>
                    Enter content above
                  </div>
                )}
              </div>
              <Button onClick={download} disabled={!qrValue} className="w-full shadow-sm shadow-primary/20">
                <Download className="h-4 w-4 mr-2" /> Download PNG
              </Button>
            </CardContent>
          </Card>

          {/* About */}
          <div className="rounded-2xl border border-border/60 bg-card/40 p-5 space-y-3">
            <h2 className="text-base font-semibold">About this tool</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Generate QR codes for any content in seconds — URLs, plain text, email addresses, phone numbers, or WiFi credentials. Customize colors and download as a high-quality PNG with one click.</p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Sharing a website or landing page on printed materials</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Creating WiFi access codes for guests or customers</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Adding contact or payment info to business cards</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Extended content */}
      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">What is a QR Code?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">A QR code (Quick Response code) is a two-dimensional barcode that can store various types of data including URLs, text, contact information, WiFi credentials, and more. Unlike traditional barcodes that only store data horizontally, QR codes store data both horizontally and vertically — allowing them to hold significantly more information in a compact square format.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">QR codes were invented in 1994 by Denso Wave, a Japanese automotive company, originally for tracking vehicle parts during manufacturing. Today they are one of the most widely used tools for bridging the physical and digital worlds — appearing on product packaging, restaurant menus, business cards, event tickets, and advertising materials worldwide.</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">How QR Codes Work</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">A QR code consists of black squares arranged on a white grid background. The pattern encodes data using a combination of position detection patterns (the three square corners), alignment patterns, timing patterns, and data modules. When a smartphone camera scans the code, it reads the pattern and decodes the stored information instantly.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">QR codes include built-in error correction that allows them to remain readable even when partially damaged or obscured — up to 30% of a QR code can be damaged and it will still scan correctly. This is why you sometimes see QR codes with logos or artwork overlaid in the center.</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">QR Code Types and Use Cases</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Our QR code generator supports multiple data types for different use cases:</p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">URL QR Codes:</strong> The most common type. Encode any website URL so users can visit a page by scanning instead of typing. Perfect for business cards, flyers, posters, and product packaging.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">WiFi QR Codes:</strong> Encode your WiFi network name (SSID), password, and security type. Guests can connect to your network by scanning without manually entering credentials — ideal for offices, cafes, hotels, and homes.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Text QR Codes:</strong> Encode any plain text message. Useful for short instructions, notes, or any information you want to share without a URL.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Email QR Codes:</strong> Encode an email address with optional pre-filled subject and body. Scanning opens the user's email client ready to send.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Phone QR Codes:</strong> Encode a phone number. Scanning immediately prompts the user to call or save the contact.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">QR Code Best Practices</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Size matters:</strong> QR codes should be at least 2cm x 2cm (0.8 x 0.8 inches) for reliable scanning. Smaller codes may not scan reliably, especially on printed materials viewed from a distance.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Contrast is critical:</strong> Always use high contrast between the QR code and its background. Black on white is most reliable. Avoid placing QR codes on busy backgrounds or using colors with low contrast.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Test before printing:</strong> Always scan your QR code with multiple devices before printing or publishing. What works on one device may not work on another.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Include a call to action:</strong> Tell users what will happen when they scan. "Scan to visit our website" or "Scan to connect to WiFi" increases scan rates.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Error correction level:</strong> Higher error correction (level H) allows more of the QR code to be damaged while remaining readable, but creates a more complex code. Use level M for most applications and level H when adding a logo or decoration.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Are QR codes free to use?", a: "Yes. QR codes are an open standard and completely free to generate and use. Our generator creates QR codes at no cost with no usage limits or expiration dates." },
              { q: "Do QR codes expire?", a: "Static QR codes (like those generated here) never expire. The data is encoded directly in the pattern and will work as long as the destination URL or content remains valid." },
              { q: "Can I customize the colors of a QR code?", a: "Yes. Our generator allows you to change the foreground and background colors. Always ensure sufficient contrast between foreground and background for reliable scanning." },
              { q: "What is the maximum amount of data a QR code can store?", a: "A QR code can store up to 4,296 alphanumeric characters, 7,089 numeric characters, or 2,953 bytes of binary data. For URLs, this is more than enough for any standard web address." },
              { q: "Can QR codes be scanned from a screen?", a: "Yes. QR codes work equally well when displayed on screens or printed on paper. Most modern smartphones can scan QR codes directly from other screens without any special app." },
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

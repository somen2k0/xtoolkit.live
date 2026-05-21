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
                  <Input value={fields.url ?? ""} onChange={(e) => setField("url", e.target.value)} placeholder="https://example.com" className="bg-background/60 border-border/60" />
                </div>
              )}
              {inputType === "text" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Text</Label>
                  <Input value={fields.text ?? ""} onChange={(e) => setField("text", e.target.value)} placeholder="Your text here" className="bg-background/60 border-border/60" />
                </div>
              )}
              {inputType === "email" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Email Address</Label>
                    <Input value={fields.email ?? ""} onChange={(e) => setField("email", e.target.value)} placeholder="name@example.com" className="bg-background/60 border-border/60" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Subject (optional)</Label>
                    <Input value={fields.subject ?? ""} onChange={(e) => setField("subject", e.target.value)} placeholder="Hello!" className="bg-background/60 border-border/60" />
                  </div>
                </div>
              )}
              {inputType === "phone" && (
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <Input value={fields.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} placeholder="+1234567890" className="bg-background/60 border-border/60" />
                </div>
              )}
              {inputType === "wifi" && (
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Network Name (SSID)</Label>
                    <Input value={fields.ssid ?? ""} onChange={(e) => setField("ssid", e.target.value)} placeholder="MyWiFiNetwork" className="bg-background/60 border-border/60" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium">Password</Label>
                    <Input value={fields.wifiPassword ?? ""} onChange={(e) => setField("wifiPassword", e.target.value)} placeholder="WiFi password" type="password" className="bg-background/60 border-border/60" />
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
                    <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} className="h-9 w-12 rounded-md border border-border/60 bg-background/60 cursor-pointer p-0.5" />
                    <Input value={fg} onChange={(e) => setFg(e.target.value)} className="font-mono text-sm bg-background/60 border-border/60 h-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="h-9 w-12 rounded-md border border-border/60 bg-background/60 cursor-pointer p-0.5" />
                    <Input value={bg} onChange={(e) => setBg(e.target.value)} className="font-mono text-sm bg-background/60 border-border/60 h-9" />
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

      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}

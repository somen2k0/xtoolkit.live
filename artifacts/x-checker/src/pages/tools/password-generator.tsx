import { useState, useCallback } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { AdSlot } from "@/components/AdSlot";
import { Copy, RefreshCw, KeyRound, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const UPPERCASE = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWERCASE = "abcdefghjkmnpqrstuvwxyz";
const NUMBERS = "23456789";
const SYMBOLS = "!@#$%^&*-_=+?";
const UPPERCASE_AMBIG = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE_AMBIG = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS_AMBIG = "0123456789";

function generatePassword(
  length: number,
  useUpper: boolean,
  useLower: boolean,
  useNumbers: boolean,
  useSymbols: boolean,
  excludeAmbiguous: boolean
): string {
  let charset = "";
  if (useUpper) charset += excludeAmbiguous ? UPPERCASE : UPPERCASE_AMBIG;
  if (useLower) charset += excludeAmbiguous ? LOWERCASE : LOWERCASE_AMBIG;
  if (useNumbers) charset += excludeAmbiguous ? NUMBERS : NUMBERS_AMBIG;
  if (useSymbols) charset += SYMBOLS;
  if (!charset) return "";

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((n) => charset[n % charset.length])
    .join("");
}

function getStrength(pw: string): { label: string; color: string; pct: number } {
  if (!pw) return { label: "", color: "bg-muted", pct: 0 };
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 16) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: "Weak", color: "bg-destructive", pct: 25 };
  if (score === 3) return { label: "Fair", color: "bg-yellow-500", pct: 50 };
  if (score === 4 || score === 5) return { label: "Strong", color: "bg-green-500", pct: 75 };
  return { label: "Very Strong", color: "bg-emerald-500", pct: 100 };
}

const faqs = [
  { q: "What makes a password strong?", a: "A strong password is long (16+ characters), uses a mix of uppercase, lowercase, numbers, and symbols, and avoids common words or patterns. This tool uses the Web Crypto API to generate truly random passwords." },
  { q: "Is my password stored anywhere?", a: "No. Passwords are generated entirely in your browser using the Web Crypto API. Nothing is sent to any server." },
  { q: "What are ambiguous characters?", a: "Ambiguous characters like 0/O and l/1 can be easily confused when reading a password aloud or typing it. Excluding them makes passwords easier to transcribe accurately." },
  { q: "How many passwords should I generate?", a: "Use a unique password for every account. Use a password manager like Bitwarden or 1Password to store them safely — you only need to remember one master password." },
];

const relatedTools = [
  { title: "UUID Generator", href: "/tools/uuid-generator", description: "Generate random UUID v4 identifiers." },
  { title: "Base64 Encoder / Decoder", href: "/tools/base64", description: "Encode and decode Base64 strings." },
  { title: "JWT Decoder", href: "/tools/jwt-decoder", description: "Decode and inspect JWT tokens." },
];

export default function PasswordGenerator() {
  useToolView("password-generator");
  const { toast } = useToast();
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbig, setExcludeAmbig] = useState(false);
  const [bulkCount, setBulkCount] = useState<1 | 5 | 10>(1);
  const [passwords, setPasswords] = useState<string[]>([]);

  const generate = useCallback(() => {
    const pws = Array.from({ length: bulkCount }, () =>
      generatePassword(length, useUpper, useLower, useNumbers, useSymbols, excludeAmbig)
    ).filter(Boolean);
    setPasswords(pws.length ? pws : [""]);
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbig, bulkCount]);

  const copyOne = (pw: string) => {
    navigator.clipboard.writeText(pw);
    toast({ title: "Copied!", description: "Password copied to clipboard." });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(passwords.join("\n"));
    toast({ title: "Copied all!", description: `${passwords.length} passwords copied.` });
  };

  const primary = passwords[0] ?? "";
  const strength = getStrength(primary);

  return (
    <MiniToolLayout
      seoTitle="Password Generator — Free Strong Password Creator | X Toolkit"
      seoDescription="Generate strong, secure passwords instantly. Customize length, include symbols, numbers, uppercase. Free online password generator, no signup required."
      icon={KeyRound}
      title="Password Generator"
      description="Generate strong, secure passwords with custom length, symbols, and bulk generation."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />

      <div className="space-y-6">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="pt-6 space-y-6">
            {/* Length */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Password Length</Label>
                <span className="text-sm font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{length}</span>
              </div>
              <Slider
                min={8}
                max={64}
                step={1}
                value={[length]}
                onValueChange={([v]) => setLength(v)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>8</span><span>64</span>
              </div>
            </div>

            {/* Options */}
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { id: "upper", label: "Include Uppercase (A–Z)", value: useUpper, set: setUseUpper },
                { id: "lower", label: "Include Lowercase (a–z)", value: useLower, set: setUseLower },
                { id: "numbers", label: "Include Numbers (0–9)", value: useNumbers, set: setUseNumbers },
                { id: "symbols", label: "Include Symbols (!@#$%^&*)", value: useSymbols, set: setUseSymbols },
                { id: "ambig", label: "Exclude Ambiguous Characters (0, O, l, 1)", value: excludeAmbig, set: setExcludeAmbig },
              ].map(({ id, label, value, set }) => (
                <div key={id} className="flex items-center gap-2.5">
                  <Checkbox id={id} checked={value} onCheckedChange={(v) => set(!!v)} />
                  <Label htmlFor={id} className="text-sm cursor-pointer">{label}</Label>
                </div>
              ))}
            </div>

            {/* Bulk count */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Generate How Many?</Label>
              <div className="flex gap-2">
                {([1, 5, 10] as const).map((n) => (
                  <Button
                    key={n}
                    variant={bulkCount === n ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBulkCount(n)}
                    className="flex-1 text-xs"
                  >
                    {n === 1 ? "Single" : `${n} passwords`}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={generate} className="w-full shadow-sm shadow-primary/20">
              <Shield className="h-4 w-4 mr-2" /> Generate Password{bulkCount > 1 ? "s" : ""}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {passwords.length > 0 && passwords[0] && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {bulkCount === 1 && primary && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/80 px-4 py-3">
                  <code className="flex-1 font-mono text-base tracking-widest break-all select-all">{primary}</code>
                  <Button variant="outline" size="sm" onClick={() => copyOne(primary)} className="shrink-0 text-xs border-border/60">
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
                  </Button>
                </div>
                {/* Strength bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Strength</span>
                    <span className="font-medium">{strength.label}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                      style={{ width: `${strength.pct}%` }}
                    />
                  </div>
                </div>
                <Button variant="outline" onClick={generate} className="w-full text-xs border-border/60">
                  <RefreshCw className="h-3.5 w-3.5 mr-2" /> Generate Another
                </Button>
              </div>
            )}

            {bulkCount > 1 && (
              <Card className="border-border/60 bg-card shadow-sm">
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{passwords.length} passwords generated</span>
                    <Button variant="outline" size="sm" onClick={copyAll} className="text-xs border-border/60">
                      <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {passwords.map((pw, i) => (
                      <div key={i} className="flex items-center gap-2 rounded-lg border border-border/50 bg-background/50 px-3 py-2 group">
                        <code className="flex-1 font-mono text-sm break-all">{pw}</code>
                        <button onClick={() => copyOne(pw)} className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors opacity-0 group-hover:opacity-100">
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" onClick={generate} className="w-full text-xs border-border/60 mt-2">
                    <RefreshCw className="h-3.5 w-3.5 mr-2" /> Regenerate
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This password generator uses the browser's built-in Web Crypto API to create cryptographically random passwords. No passwords are ever sent to a server — generation happens entirely on your device, making it safe to use even for sensitive accounts.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You can customize the character set, length (8–64 characters), and generate up to 10 passwords at once. The strength indicator gives you instant feedback on password quality.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Creating a unique password for every new account or service</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Generating API keys or temporary secrets for development</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Bulk-creating passwords for a team or user list</li>
          </ul>
        </div>
      </div>

      {/* Extended content */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Why Strong Passwords Matter</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Weak passwords are one of the leading causes of account compromise and data breaches. A simple 8-character password using only lowercase letters can be cracked in seconds using modern hardware. By contrast, a 16-character password combining uppercase letters, lowercase letters, numbers, and symbols would take thousands of years to crack using the same technology.</p>
          <p className="text-sm text-muted-foreground leading-relaxed">In 2024 alone, billions of credentials were exposed in data breaches. The majority of compromised accounts used passwords that were too short, too simple, or reused across multiple services. Using a unique, randomly generated strong password for every account is the single most effective security measure available to regular users.</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Understanding Password Strength</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Password strength is determined by entropy — a measure of unpredictability. Entropy is calculated based on the size of the character set used and the length of the password. The formula is: Entropy = Length × log2(Character Set Size).</p>
          <p className="text-sm text-muted-foreground leading-relaxed">A password using only lowercase letters (26 characters) has much lower entropy than one using all character types (uppercase + lowercase + numbers + symbols = 95 possible characters). This is why our generator defaults to using all character types.</p>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> 8 characters: Minimum acceptable (not recommended for important accounts)</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> 12 characters: Good for most accounts</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> 16 characters: Strong, recommended for important accounts like email and banking</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> 20+ characters: Very strong, recommended for master passwords and high-value accounts</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Password Security Best Practices</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Use a unique password for every account:</strong> If one site is breached and you use the same password elsewhere, attackers can access all your accounts. This attack is called credential stuffing and is extremely common.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Use a password manager:</strong> Strong unique passwords for every account are impossible to remember. Password managers like Bitwarden (free), 1Password, or LastPass store your passwords securely so you only need to remember one master password.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Enable two-factor authentication:</strong> Even the strongest password can be compromised through phishing or data breaches. Two-factor authentication adds a second layer of security so attackers cannot access your account with your password alone.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Never share passwords:</strong> Never send a password in an email, text message, or chat. These communications are often not encrypted and can be intercepted.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Change passwords after breaches:</strong> If a service you use reports a data breach, change your password immediately. Use our tool to generate a new strong password instantly.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Common Password Mistakes to Avoid</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Using personal information:</strong> Passwords based on your name, birthday, pet's name, or other personal information are easy to guess for anyone who knows you — and this information is often publicly available on social media.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Simple substitutions:</strong> Replacing letters with numbers (p4ssw0rd) or adding numbers at the end (password123) provides almost no additional security. Automated cracking tools are specifically designed to try these common patterns.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Short passwords:</strong> Every character you add to a password exponentially increases the number of possible combinations. A 12-character password is not just 50% harder to crack than an 8-character password — it is millions of times harder.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">Reusing passwords:</strong> Using the same password across multiple sites means a single breach exposes all your accounts. Always use unique passwords.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "How random are the generated passwords?", a: "Our generator uses the Web Crypto API (window.crypto.getRandomValues) which is a cryptographically secure random number generator. This is the same technology used by security professionals and is significantly more random than Math.random()." },
              { q: "Is it safe to generate passwords online?", a: "Yes. Our password generator runs entirely in your browser — no passwords are sent to any server or stored anywhere. You can verify this by turning off your internet connection and the generator will still work." },
              { q: "How long should my password be?", a: "For most accounts, 16 characters is a good balance of security and usability. For master passwords and high-value accounts, use 20+ characters." },
              { q: "Should I include symbols in my password?", a: "Yes when possible. Symbols expand the character set from 62 (letters + numbers) to 95 characters, significantly increasing password strength. Some sites don't support all symbols — our generator only uses widely accepted symbols." },
              { q: "What does \"exclude ambiguous characters\" mean?", a: "Characters like 0 (zero) and O (letter O), 1 (one) and l (letter L) look similar and can cause confusion when reading a password aloud or typing it manually. Excluding them makes passwords easier to use without reducing security significantly." },
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

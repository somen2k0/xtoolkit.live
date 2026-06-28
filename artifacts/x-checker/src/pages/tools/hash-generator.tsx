import { useState, useCallback } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { AdSlot } from "@/components/AdSlot";
import { Copy, Hash, Loader2 } from "lucide-react";

// ─── SHA via Web Crypto API ──────────────────────────────────────────────────

async function sha(algorithm: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// ─── MD5 (pure JS implementation) ───────────────────────────────────────────

function md5(input: string): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }
  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }
  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }
  function binlMD5(x: number[], len: number): number[] {
    x[len >> 5] |= 0x80 << (len % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;
    let i; let olda; let oldb; let oldc; let oldd;
    let a = 1732584193; let b = -271733879; let c = -1732584194; let d = 271733878;
    for (i = 0; i < x.length; i += 16) {
      olda = a; oldb = b; oldc = c; oldd = d;
      a = md5ff(a, b, c, d, x[i], 7, -680876936); d = md5ff(d, a, b, c, x[i + 1], 12, -389564586);
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819); b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330);
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897); d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426);
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341); b = md5ff(b, c, d, a, x[i + 7], 22, -45705983);
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416); d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417);
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063); b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162);
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682); d = md5ff(d, a, b, c, x[i + 13], 12, -40341101);
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290); b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329);
      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510); d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632);
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713); b = md5gg(b, c, d, a, x[i], 20, -373897302);
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691); d = md5gg(d, a, b, c, x[i + 10], 9, 38016083);
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335); b = md5gg(b, c, d, a, x[i + 4], 20, -405537848);
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438); d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690);
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961); b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501);
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467); d = md5gg(d, a, b, c, x[i + 2], 9, -51403784);
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473); b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734);
      a = md5hh(a, b, c, d, x[i + 5], 4, -378558); d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463);
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562); b = md5hh(b, c, d, a, x[i + 14], 23, -35309556);
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060); d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353);
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632); b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640);
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174); d = md5hh(d, a, b, c, x[i], 11, -358537222);
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979); b = md5hh(b, c, d, a, x[i + 6], 23, 76029189);
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487); d = md5hh(d, a, b, c, x[i + 12], 11, -421815835);
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520); b = md5hh(b, c, d, a, x[i + 2], 23, -995338651);
      a = md5ii(a, b, c, d, x[i], 6, -198630844); d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415);
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905); b = md5ii(b, c, d, a, x[i + 5], 21, -57434055);
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571); d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606);
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523); b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799);
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359); d = md5ii(d, a, b, c, x[i + 15], 10, -30611744);
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380); b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649);
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070); d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379);
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259); b = md5ii(b, c, d, a, x[i + 9], 21, -343485551);
      a = safeAdd(a, olda); b = safeAdd(b, oldb); c = safeAdd(c, oldc); d = safeAdd(d, oldd);
    }
    return [a, b, c, d];
  }
  function binl2rstr(input: number[]): string {
    let output = "";
    for (let i = 0; i < input.length * 32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff);
    }
    return output;
  }
  function rstr2binl(input: string): number[] {
    const output: number[] = new Array(input.length >> 2).fill(0);
    for (let i = 0; i < input.length; i += 1) {
      output[i >> 2] |= input.charCodeAt(i) << (i % 4 * 8);
    }
    return output;
  }
  function rstrMD5(s: string): string {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8));
  }
  function rstr2hex(inp: string): string {
    const hexTab = "0123456789abcdef";
    let output = "";
    for (let i = 0; i < inp.length; i += 1) {
      const x = inp.charCodeAt(i);
      output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f);
    }
    return output;
  }
  function str2rstrUTF8(inp: string): string {
    return unescape(encodeURIComponent(inp));
  }
  return rstr2hex(rstrMD5(str2rstrUTF8(input)));
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Hashes {
  md5: string;
  sha1: string;
  sha256: string;
  sha512: string;
}

const faqs = [
  { q: "What is a hash function?", a: "A hash function is a mathematical algorithm that takes an input of any size and produces a fixed-size output (the hash or digest). The same input always produces the same output, but even a tiny change in the input produces a completely different hash. Hash functions are designed to be one-way — you cannot reconstruct the original input from the hash alone." },
  { q: "Is MD5 still safe to use?", a: "MD5 is no longer considered cryptographically secure for security-critical purposes. Researchers have demonstrated collision attacks — finding two different inputs that produce the same MD5 hash. MD5 should not be used for password storage, digital signatures, or certificate integrity. However, it is still commonly used for non-security purposes like file checksums and data deduplication." },
  { q: "Which hash algorithm should I use for passwords?", a: "None of the algorithms in this tool are suitable for password storage. MD5, SHA-1, SHA-256, and SHA-512 are all too fast — an attacker with a GPU can compute billions of them per second. For passwords, always use a purpose-built, slow hashing algorithm: bcrypt, scrypt, or Argon2 (the current best practice as of 2026)." },
  { q: "What does SHA stand for?", a: "SHA stands for Secure Hash Algorithm. The SHA family was developed by the National Security Agency (NSA) and published by NIST (National Institute of Standards and Technology). SHA-1 produces a 160-bit hash. SHA-256 and SHA-512 are part of the SHA-2 family and produce 256-bit and 512-bit hashes respectively. SHA-3 is a newer standard with a different internal design." },
  { q: "Does this tool send my data to a server?", a: "No. All hash calculations happen entirely in your browser using the Web Crypto API (for SHA-1, SHA-256, SHA-512) and a pure JavaScript MD5 implementation. Your input text is never sent to any server. You can verify this by opening your browser's network tab — no requests are made when you click Generate Hashes." },
];

const relatedTools = [
  { title: "Password Generator", href: "/tools/password-generator", description: "Generate strong, secure passwords instantly." },
  { title: "Base64 Encoder / Decoder", href: "/tools/base64", description: "Encode and decode Base64 strings." },
  { title: "JWT Decoder", href: "/tools/jwt-decoder", description: "Decode and inspect JWT tokens." },
];

export default function HashGenerator() {
  useToolView("hash-generator");
  const { toast } = useToast();

  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Hashes | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const generateHashes = useCallback(async () => {
    if (!input.trim()) {
      toast({ title: "Empty input", description: "Please enter some text to hash.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const [sha1, sha256, sha512] = await Promise.all([
        sha("SHA-1", input),
        sha("SHA-256", input),
        sha("SHA-512", input),
      ]);
      setHashes({ md5: md5(input), sha1, sha256, sha512 });
    } catch {
      toast({ title: "Error", description: "Failed to generate hashes.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [input, toast]);

  const copyHash = useCallback((key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    toast({ title: "Copied!", description: `${key.toUpperCase()} hash copied.` });
    setTimeout(() => setCopiedKey(null), 2000);
  }, [toast]);

  const hashRows: { key: keyof Hashes; label: string; bits: number }[] = [
    { key: "md5", label: "MD5", bits: 128 },
    { key: "sha1", label: "SHA-1", bits: 160 },
    { key: "sha256", label: "SHA-256", bits: 256 },
    { key: "sha512", label: "SHA-512", bits: 512 },
  ];

  return (
    <MiniToolLayout
      seoTitle="Hash Generator — Free MD5, SHA-1, SHA-256 & SHA-512 Online | X Toolkit"
      seoDescription="Generate MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes from any text. Runs entirely in your browser using the Web Crypto API. Free, instant, no signup."
      seoKeywords="hash generator, md5 generator, sha256 generator, sha-512 hash, sha1 online, hash text online, md5 hash calculator, crypto hash generator, sha256 online, checksum generator"
      icon={Hash}
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text instantly. Runs entirely in your browser — nothing sent to a server."
      faqs={faqs}
      relatedTools={relatedTools}
    >
      <AdSlot slot="top" className="mb-6" />

      <div className="space-y-6">
        <Card className="border-border/60 bg-card shadow-sm">
          <CardContent className="pt-5 pb-5 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Text to Hash</Label>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to hash..."
                rows={4}
                className="font-mono text-sm resize-y bg-muted/20"
                spellCheck={false}
              />
            </div>
            <Button
              onClick={generateHashes}
              disabled={loading}
              className="w-full shadow-sm shadow-primary/20"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
              ) : (
                <><Hash className="h-4 w-4 mr-2" /> Generate Hashes</>
              )}
            </Button>
          </CardContent>
        </Card>

        {hashes && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {hashRows.map(({ key, label, bits }) => (
              <div key={key} className="rounded-xl border border-border/60 bg-card/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-xs text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">{bits} bits</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyHash(key, hashes[key])}
                    className="text-xs border-border/60 shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    {copiedKey === key ? "Copied!" : "Copy"}
                  </Button>
                </div>
                <code className="block text-xs font-mono break-all text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 select-all">
                  {hashes[key]}
                </code>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extended content */}
      <div className="space-y-6 pt-4">
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">What is a Hash Function?</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A cryptographic hash function is a mathematical algorithm that takes an arbitrary amount of input data and produces a fixed-size output called a hash, digest, or checksum. No matter how large or small the input is — a single character or a multi-gigabyte file — the output is always the same length for a given algorithm. SHA-256, for example, always produces exactly 256 bits (64 hex characters).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hash functions have three critical properties that make them useful for security applications. First, they are deterministic — the same input always produces the same output. Second, they are one-way — given a hash, you cannot calculate the original input (without trying every possible input). Third, they are collision-resistant — it is computationally infeasible to find two different inputs that produce the same hash.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The avalanche effect is another key property: changing even a single bit in the input produces a completely different hash. This is what makes hashes useful as fingerprints — even the smallest change in a file produces a visually unrelated hash, making tampering immediately detectable.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">MD5 vs SHA-1 vs SHA-256 vs SHA-512</h2>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">MD5 (128 bits):</strong> Fast but cryptographically broken. Collision attacks have been demonstrated. Use only for non-security checksums and data deduplication, never for security-sensitive applications.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">SHA-1 (160 bits):</strong> Also broken — Google demonstrated a practical SHA-1 collision in 2017 ("SHAttered"). Deprecated by major browsers and CAs. Avoid for all new security applications.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">SHA-256 (256 bits):</strong> Part of the SHA-2 family. Currently considered secure and is the standard for most security applications including TLS certificates, code signing, and Bitcoin. Recommended for general use.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span><span><strong className="text-foreground/80">SHA-512 (512 bits):</strong> More collision-resistant than SHA-256 due to its larger output. Slightly slower but useful for high-security scenarios or when defending against future advances in collision attacks.</span></li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Common Uses for Hash Functions</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hash functions appear throughout modern computing in many contexts. File integrity verification is one of the most common: when you download software, the developer often provides a SHA-256 checksum so you can verify the file was not corrupted or tampered with during download. Package managers like npm, pip, and Homebrew use hashes to verify downloaded packages.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            In version control systems like Git, every commit, file, and directory is identified by a SHA-1 hash (being migrated to SHA-256 in newer Git versions). This gives Git its content-addressable storage model — the same content always gets the same hash, making deduplication automatic.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Digital signatures rely on hashes: instead of signing an entire document, you sign its hash. This is much faster while maintaining the same security guarantee. HTTPS certificates use SHA-256 for this purpose.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Hash Functions and Security</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            While hash functions are foundational to cryptography, they are often misused. The most common mistake is using a fast hash function like MD5 or SHA-256 to store passwords. Because these algorithms compute billions of hashes per second on modern hardware, an attacker with a leaked password database can brute-force most passwords within hours or days.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The correct approach for passwords is to use a dedicated password hashing algorithm designed to be slow: bcrypt (widely used, good default), scrypt (memory-hard), or Argon2 (winner of the Password Hashing Competition, current best practice). These algorithms deliberately use more CPU and memory, making brute-force attacks orders of magnitude more expensive.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-3">
          <h2 className="text-lg font-semibold">Why Hash Length Matters</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The length of a hash directly determines its collision resistance. A 128-bit hash (MD5) has 2^128 possible values — approximately 3.4 × 10^38. A 256-bit hash has 2^256 possible values — approximately 1.2 × 10^77. The difference is not just bigger, it is astronomically bigger.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The birthday paradox tells us that collisions become likely after approximately 2^(n/2) hashes are computed, where n is the hash length. For MD5, this is 2^64 (around 18 quintillion) — feasible for a well-funded attacker with specialized hardware. For SHA-256, it is 2^128 — currently infeasible. For SHA-512, it is 2^256 — representing a massive margin of safety against any foreseeable computational advances.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For most practical applications, SHA-256 provides more than adequate collision resistance. SHA-512 is worth considering in very high-security contexts or when you want extra protection against algorithmic advances that might reduce the effective security level of shorter hashes.
          </p>
        </div>
      </div>

      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}

import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { Shuffle, Copy, Trash2, ShieldCheck, Zap } from "lucide-react";

const faqs = [
  { q: "What is a UUID?", a: "A UUID (Universally Unique Identifier) is a 128-bit label used to uniquely identify information in computer systems. The standard format is 8-4-4-4-12 hexadecimal characters separated by hyphens, e.g. 550e8400-e29b-41d4-a716-446655440000." },
  { q: "What is UUID v4?", a: "UUID version 4 is randomly generated. It uses 122 random bits and 6 fixed bits to denote the version and variant. It is the most commonly used UUID version because it requires no coordination between systems and has an astronomically low collision probability." },
  { q: "Can UUIDs collide?", a: "Theoretically yes, but practically no. With UUID v4, the probability of generating two identical UUIDs is so low that you'd need to generate about 1 billion UUIDs per second for 85 years before having a 50% chance of a single collision." },
  { q: "Is it safe to use UUIDs as primary keys?", a: "Yes. UUIDs are widely used as database primary keys, especially in distributed systems where auto-incrementing integers would create conflicts across multiple nodes. The main tradeoff is that UUIDs are larger (16 bytes vs 4-8 bytes) and can reduce index performance at very large scale." },
];

const relatedTools = [
  { title: "Base64 Encoder / Decoder", href: "/tools/base64", description: "Encode and decode Base64 strings." },
  { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON instantly." },
  { title: "URL Encoder / Decoder", href: "/tools/url-encoder", description: "Encode or decode URLs and query parameters." },
];

function generateUUID(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, generateUUID));
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);
  const { toast } = useToast();
  useToolView("uuid-generator");

  const format = (id: string) => {
    let v = id;
    if (noDashes) v = v.replace(/-/g, "");
    if (uppercase) v = v.toUpperCase();
    return v;
  };

  const generate = () => {
    setUuids(Array.from({ length: count }, generateUUID));
  };

  const copyOne = (id: string) => {
    navigator.clipboard.writeText(format(id));
    toast({ title: "Copied!", description: "UUID copied to clipboard." });
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.map(format).join("\n"));
    toast({ title: "Copied!", description: `${uuids.length} UUIDs copied to clipboard.` });
  };

  const clear = () => setUuids([]);

  return (
    <MiniToolLayout
      seoTitle="UUID Generator Online Free — v4 UUID"
      seoDescription="Generate random UUID v4 identifiers online for free. Instant generation, no signup, 100% client-side."
      icon={Shuffle}
      badge="Developer Tool"
      title="UUID Generator"
      description="Generate random UUID v4 identifiers instantly. All UUIDs are generated in your browser using the Web Crypto API — nothing is sent to a server."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="all"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Count:</span>
            <div className="flex items-center gap-1">
              {[1, 5, 10, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${count === n ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground hover:text-foreground"}`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              <input id="uppercase" name="uppercase" type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="rounded" />
              Uppercase
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground hover:text-foreground">
              <input id="no-dashes" name="no-dashes" type="checkbox" checked={noDashes} onChange={(e) => setNoDashes(e.target.checked)} className="rounded" />
              No dashes
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={generate} className="text-xs shadow-sm shadow-primary/20 gap-1.5">
            <Shuffle className="h-3.5 w-3.5" />
            Generate {count} UUID{count !== 1 ? "s" : ""}
          </Button>
          <Button variant="outline" size="sm" onClick={copyAll} disabled={uuids.length === 0} className="text-xs border-border/60 gap-1.5">
            <Copy className="h-3.5 w-3.5" />
            Copy All
          </Button>
          <Button variant="ghost" size="sm" onClick={clear} disabled={uuids.length === 0} className="text-xs gap-1.5 text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3.5 w-3.5" />
            Clear
          </Button>
        </div>

        {uuids.length > 0 && (
          <div className="space-y-2">
            {uuids.map((id, i) => (
              <div key={i} className="group flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-card/40 hover:border-primary/30 hover:bg-card transition-all">
                <code className="flex-1 font-mono text-sm text-foreground/90 break-all">{format(id)}</code>
                <button
                  onClick={() => copyOne(id)}
                  className="shrink-0 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {uuids.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-xl border border-dashed border-border/40">
            <Shuffle className="h-8 w-8 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground/50">Click Generate to create UUIDs</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {[{ icon: ShieldCheck, label: "100% client-side" }, { icon: Zap, label: "Web Crypto API" }, { icon: Shuffle, label: "UUID v4" }].map(({ icon: Ic, label }) => (
            <div key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3 py-1">
              <Ic className="h-3 w-3" />{label}
            </div>
          ))}
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This UUID generator creates cryptographically random UUID v4 identifiers using the browser's built-in Web Crypto API — the same API used by operating systems and password managers. Generate one or bulk-create up to 20 UUIDs at a time, and copy them individually or all at once.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            UUID v4 identifiers are 128-bit values with 2¹²² possible combinations, making collisions astronomically unlikely — suitable for use as primary keys, session tokens, or correlation IDs.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Generating primary keys for database records or test fixtures</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Creating unique identifiers for API requests or event tracking</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Populating mock data with unique IDs for development</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Choose how many UUIDs to generate: 1, 5, 10, or 20 at a time using the count selector.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Optionally enable <strong className="text-foreground/80">Uppercase</strong> or <strong className="text-foreground/80">No Dashes</strong> formatting to match your project's requirements.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Click <strong className="text-foreground/80">Generate</strong> — each UUID is created using <code className="text-xs font-mono bg-muted/60 rounded px-1">crypto.randomUUID()</code>, a cryptographically secure source.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> Copy individual UUIDs by hovering over them, or copy all at once with "Copy All".</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Use directly in your code, database seed files, API test payloads, or wherever unique IDs are needed.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Database primary keys</strong> for distributed systems where auto-increment IDs would conflict across nodes.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Session and transaction identifiers</strong> for tracking user sessions, payments, and API requests.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">REST API resource identifiers</strong> in RESTful APIs where resources need globally unique IDs.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">File naming</strong> to prevent conflicts when uploading user files to cloud storage (S3, GCS, etc.).</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Test data generation</strong> — seeding development databases with realistic-looking unique identifiers.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Idempotency keys</strong> for API requests to prevent duplicate processing of retried operations.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Software developers, database architects, API developers, and DevOps engineers generate UUIDs constantly. Any distributed system, microservices architecture, or scalable web application relies on UUIDs to uniquely identify records without requiring a central ID-generating authority. Full-stack developers use them for database record IDs during development. QA engineers use them to generate test data. Data engineers use them as correlation IDs when tracing requests across multiple services.
          </p>
        </div>

        {/* Understanding UUIDs */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Understanding UUIDs in depth</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A UUID (Universally Unique Identifier) is a 128-bit number used to uniquely identify information. UUID version 4 is randomly generated using a cryptographically secure pseudorandom number generator. The probability of generating two identical UUID v4s is approximately 1 in 5.3 undecillion — making collisions essentially impossible in any real-world application. UUIDs are represented as 32 hexadecimal digits displayed in 5 groups separated by hyphens: <code className="text-xs font-mono bg-muted/60 rounded px-1">xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Auto-increment integers (1, 2, 3…) are simpler but expose your data volume and are prone to enumeration attacks — anyone can guess sequential IDs. UUIDs are random and reveal nothing about your data. The main tradeoff is that UUIDs take 16 bytes of storage versus 4–8 bytes for integers, and random UUIDs can cause index fragmentation in databases at very large scale (billions of rows).
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "What is a UUID?", a: "A UUID is a 128-bit identifier that is unique across all systems without requiring a central registry to coordinate ID assignment. Version 4 UUIDs are randomly generated using a cryptographically secure source, making them suitable for use in distributed systems." },
              { q: "What is the difference between UUID v1 and v4?", a: "UUID v1 uses the current timestamp and the machine's MAC address to generate the ID — making it time-ordered but potentially traceable to a specific computer. UUID v4 is purely random, revealing nothing about when or where it was generated. V4 is preferred for most applications because it doesn't expose system information." },
              { q: "Can two UUIDs ever be the same?", a: "Theoretically yes, but practically impossible. The probability of generating a duplicate UUID v4 is approximately 1 in 5.3 undecillion (5.3 × 10³⁶). You'd need to generate about 1 billion UUIDs per second for 85 years to have a 50% chance of a single collision." },
              { q: "Should I use UUID or auto-increment for database IDs?", a: "UUIDs are better for distributed systems, microservices, and APIs where you need to generate IDs before inserting to a database. They also prevent enumeration attacks. Auto-increment integers are simpler and more performant for small-to-medium single-database applications where these concerns don't apply." },
              { q: "What is a GUID? Is it the same as UUID?", a: "GUID (Globally Unique Identifier) is Microsoft's term for UUID. They are the same specification with different names — GUIDs use the same 128-bit format and generation algorithm as UUIDs. You'll see GUID used in Microsoft documentation (.NET, SQL Server, Azure) and UUID everywhere else." },
            ].map(({ q, a }) => (
              <div key={q} className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground/80">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MiniToolLayout>
  );
}

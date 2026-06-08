import { useState } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Type, Copy, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FONT_STYLES, convertToFont } from "@/lib/unicode-fonts";
import { useTrack, useToolView } from "@/hooks/use-track";

const faqs = [
  { q: "Do Unicode fonts work on Twitter?", a: "Yes! Twitter/X supports Unicode characters, which means you can use stylized mathematical fonts in your tweets and bio. These characters are actual Unicode letters from the Mathematical Alphanumeric Symbols block, not images, so they work everywhere that supports Unicode text." },
  { q: "Is using fancy fonts on Twitter against the rules?", a: "Twitter's Terms of Service don't explicitly prohibit Unicode fonts. However, Twitter has occasionally restricted heavily formatted bios. Bold and italic variants are generally safe. Avoid overusing exotic fonts as they can hurt readability and be inaccessible to screen readers." },
  { q: "Will these fonts work on mobile Twitter?", a: "Yes — since these are standard Unicode characters, they render on all devices and platforms that support Unicode, including iOS and Android Twitter apps. Some older devices may show placeholder boxes for very rare characters." },
  { q: "Why don't some characters convert?", a: "Not every Unicode font block includes all characters. Some styles (like Fraktur and Script) have known exceptions for specific capital letters — these use alternative code points. Spaces, numbers, and most punctuation don't have Unicode font equivalents and are kept as-is." },
  { q: "Can I use these fonts for my Twitter name?", a: "Yes! You can paste any of these font variants directly into your Twitter display name or bio field. Just copy the text, go to Twitter Settings, and paste it into the Name or Bio field." },
];

const relatedTools = [
  { title: "Twitter Bio Ideas", href: "/tools/bio-generator", description: "Generate bio ideas for any niche in seconds." },
  { title: "Tweet Formatter", href: "/tools/tweet-formatter", description: "Split long text into a numbered tweet thread." },
  { title: "Character Counter", href: "/tools/character-counter", description: "Count characters against Twitter's 160-char bio limit." },
  { title: "Tweet Formatter", href: "/tools/tweet-formatter", description: "Split long text into a numbered thread." },
];

const DEFAULT_TEXT = "Hello World";

export default function FontPreview() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const { toast } = useToast();
  const track = useTrack("font-preview");
  useToolView("font-preview");

  const copy = (converted: string, styleName: string) => {
    navigator.clipboard.writeText(converted);
    track("copy_font", { label: styleName });
    toast({ title: "Copied!", description: `${styleName} style copied.` });
  };

  return (
    <MiniToolLayout
      seoTitle="Twitter Font Preview — Unicode Fonts for Tweets & Bios"
      seoDescription="Preview your text in 12+ Unicode font styles for Twitter. Bold, italic, script, fraktur, monospace and more. Copy any style with one click."
      icon={Type}
      badge="Free Tool"
      title="Twitter Font Preview"
      description="Type any text and instantly preview it in 12+ Unicode font styles — bold, italic, script, monospace, and more. Copy any style and paste it directly into your Twitter bio or tweet."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="design"
    >
      <div className="space-y-5">
        <div className="relative">
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type text to preview fonts..."
            className="text-sm bg-background/60 border-border/60 focus-visible:ring-primary/40 pr-9"
            maxLength={80}
          />
          {text && (
            <button onClick={() => setText("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground -mt-2">Tip: spaces, punctuation, and most special characters stay unchanged.</p>

        {text.trim() ? (
          <div className="grid gap-3">
            {FONT_STYLES.map((style) => {
              const converted = convertToFont(text, style);
              return (
                <div key={style.key} className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3.5 hover:border-primary/25 transition-all">
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">{style.name}</span>
                    <p className="text-base font-medium break-all">{converted}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copy(converted, style.name)}
                    className="shrink-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity border border-transparent hover:border-border/60"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 py-12 text-center text-sm text-muted-foreground/60">
            Type something above to see all font previews
          </div>
        )}

        {/* Quick copy row */}
        {text.trim() && (
          <div className="rounded-xl border border-border/60 bg-card/40 p-4 space-y-2">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Quick Copy — Popular Styles</p>
            <div className="flex flex-wrap gap-2">
              {FONT_STYLES.slice(0, 4).map(style => {
                const converted = convertToFont(text, style);
                return (
                  <button
                    key={style.key}
                    onClick={() => copy(converted, style.name)}
                    title={`Copy ${style.name}`}
                    className="font-medium text-sm px-3 py-1.5 rounded-lg border border-border/60 bg-background/60 hover:border-primary/40 hover:bg-primary/5 transition-all text-foreground"
                  >
                    {converted}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This font preview tool converts your text into Unicode character variants — bold, italic, cursive, monospace, and more — that can be copied and pasted directly into X (Twitter) bios, tweets, Instagram captions, and other platforms that don't support native text formatting.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These are real Unicode characters, not HTML tags — they display anywhere plain text is accepted, including social media bios and messaging apps.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Making your X or Instagram bio stand out with styled text</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Adding bold or italic emphasis in tweets (which don't support Markdown)</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Creating aesthetic usernames or display names with special characters</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Type your text in the input field above — letters and numbers convert best. Spaces and punctuation remain unchanged.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> See your text rendered instantly in all available Unicode font styles simultaneously — no need to select styles one by one.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Scroll through styles to find your favorite — bold, italic, script, monospace, fraktur, double-struck, and many more.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> Hover over any style card and click <strong className="text-foreground/80">Copy</strong> to copy that version to your clipboard.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Paste directly into Twitter/X, Instagram, TikTok, LinkedIn, or any platform supporting Unicode text.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Creating stylish Twitter/X bios</strong> with bold or script text that stands out from plain-text profiles.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Making social media posts stand out</strong> visually with styled text when the platform doesn't support markdown.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Adding emphasis</strong> to key words or phrases in tweets and captions without HTML or markdown support.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Creating aesthetic display names</strong> on platforms that allow Unicode in name fields.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Designing eye-catching headlines and captions</strong> for Instagram, TikTok, and LinkedIn content.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Adding visual variety</strong> to social media content to increase engagement and stop-the-scroll appeal.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Content creators, social media influencers, Twitter/X power users, and anyone who wants their profile or posts to stand out visually use Unicode font tools. The ability to use bold, italic, or script text in places that normally only support plain text makes content immediately more eye-catching and distinctive. Profile designers use it to create memorable bios. Aesthetic accounts use it for their distinct visual identity. Marketers use styled text to draw attention to key phrases in promotional posts.
          </p>
        </div>

        {/* Understanding Unicode fonts */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Understanding Unicode fonts</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            What appear to be "different fonts" are actually different Unicode characters that look like styled versions of regular letters. The bold 𝗔 and the regular A are completely different Unicode code points — they just look visually similar. This is why they work in text fields that don't support HTML or rich text formatting: Twitter/X bios, Instagram captions, and most social media text fields fully support Unicode, making these styled characters work everywhere plain text is accepted.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Available styles include: Bold, Italic, Bold Italic, Script, Bold Script, Fraktur (Gothic), Double-Struck (Blackboard Bold), Monospace, Sans-Serif, Sans-Serif Bold, Sans-Serif Italic, Circled characters, and more. Each style gives your text a completely different visual character — from professional bold to playful script to technical monospace.
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "What are Unicode fonts?", a: "Unicode fonts are characters from the Unicode standard that visually resemble styled letter variants — bold, italic, script, monospace, etc. They're actual character code points, not formatting, so they work in any text field that supports Unicode (which includes almost all modern platforms)." },
              { q: "Will Unicode fonts work on all platforms?", a: "Most modern platforms fully support Unicode including Twitter/X, Instagram, Facebook, LinkedIn, WhatsApp, Telegram, and Discord. Some older apps or platforms may render unsupported characters as boxes or question marks, but this is increasingly rare." },
              { q: "Can I use Unicode fonts in my Twitter/X bio?", a: "Yes. Twitter/X fully supports Unicode characters in bios, display names, and tweets. This is why you see profiles with styled text in their bios — they're using Unicode mathematical characters that look like different fonts." },
              { q: "Why do some Unicode characters show as boxes on some devices?", a: "Some devices or older operating systems don't include fonts that cover all Unicode character ranges. This is a device/OS limitation, not an issue with the characters themselves. Modern devices (iOS 15+, Android 10+, Windows 10+) support virtually all Unicode characters." },
              { q: "Are Unicode styled characters searchable on Twitter/X?", a: "No. 𝗕𝗼𝗹𝗱 text and Bold text are different Unicode code points. Platform search functions treat them as different characters, so content in styled Unicode won't appear when users search for the plain-text version of those words. Keep this in mind for hashtags and key terms you want to be discoverable." },
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

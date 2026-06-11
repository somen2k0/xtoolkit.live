import {
  Type, Hash, MessageSquare, BarChart2, AtSign, Users,
  AlignLeft, Scissors, Eye, Zap, Sparkles, Code2, TrendingUp,
} from "lucide-react";
import { ALL_TOOLS } from "@/lib/tools-registry";
import { CategoryLandingPage, type CategoryPageConfig } from "./CategoryLandingPage";

const tools = ALL_TOOLS.filter((t) => t.category === "text-formatting");

const config: CategoryPageConfig = {
  path: "/text-format-tools",
  seoTitle: "Free Text & Formatting Tools for X (Twitter) — Thread Formatter, Font Preview | X Toolkit",
  seoDescription:
    "Free text and formatting tools for X (Twitter): format tweet threads, preview Unicode fonts, count characters, format hashtags, and generate usernames. No signup required.",
  title: "Text & Formatting Tools",
  tagline: "Format, style, and polish your X content before you post",
  description:
    "Text formatting tools help you shape, clean, and style written content before it goes live on X (Twitter) or any other platform. Whether you're splitting a long essay into a numbered tweet thread, previewing your bio in stylized Unicode fonts, or normalizing a messy list of hashtags, these browser-based utilities handle the tedious formatting work instantly — no account required. All six tools run entirely in your browser, so your text never leaves your device.",
  icon: Type,
  color: "text-green-400",
  bg: "bg-green-400/10 border-green-400/20",
  heroGradient: "bg-gradient-to-br from-green-500/8 via-green-500/3 to-transparent",
  tools,

  whatIs:
    "Text and formatting tools are utilities that help you shape, style, and organize your X (Twitter) content before it goes live. The Tweet Thread Formatter takes a long piece of writing and automatically splits it into numbered tweet-sized chunks with correct character limits — no manual cutting needed. The Character Counter tracks characters, words, and sentences in real time so you always know exactly how close you are to X's 280-character limit. Font Preview lets you see your text rendered in Unicode-based decorative and stylistic fonts before copying the result into your bio or tweet. The Hashtag Formatter deduplicates and normalizes messy hashtag lists. Username Generator creates available-style handle ideas for any niche, and Display Name Ideas helps you find a memorable, on-brand name for your profile.",

  benefits: [
    {
      icon: Scissors,
      title: "Auto-split threads perfectly",
      description:
        "Paste long content and the thread formatter splits it at natural sentence boundaries, adding numbering automatically.",
    },
    {
      icon: BarChart2,
      title: "Never go over the character limit",
      description:
        "Real-time character, word, and sentence counts ensure every tweet and bio fits within X's limits.",
    },
    {
      icon: Eye,
      title: "Preview fonts before you commit",
      description:
        "See exactly how Unicode-style decorative fonts will render in your bio — no copy-paste guessing.",
    },
    {
      icon: Hash,
      title: "Clean hashtag lists instantly",
      description:
        "Remove duplicates, fix capitalization, and format a messy hashtag list into a clean, ready-to-use set.",
    },
    {
      icon: AtSign,
      title: "Find available-style usernames",
      description:
        "Generate dozens of on-brand handle variations for your niche so you can find one that's not already taken.",
    },
    {
      icon: Zap,
      title: "All in your browser",
      description:
        "No uploads, no servers processing your text — everything runs locally in your browser for speed and privacy.",
    },
  ],

  useCases: [
    {
      title: "Writers formatting long-form content as threads",
      description:
        "Convert an essay, newsletter excerpt, or long post into a numbered tweet thread automatically, without manually counting characters per segment.",
    },
    {
      title: "Creators styling bios with Unicode fonts",
      description:
        "Use the font preview tool to make your profile bio visually distinctive with bold, italic, or stylized Unicode characters that stand out in the feed.",
    },
    {
      title: "Marketers building hashtag strategies",
      description:
        "Paste a raw list of potential hashtags, clean out duplicates and inconsistent formatting, then copy the finished list directly into your scheduling tool.",
    },
    {
      title: "New accounts choosing a username",
      description:
        "Enter your niche or brand name and instantly see dozens of available-style handle variations to find the perfect fit.",
    },
    {
      title: "Community managers staying under the limit",
      description:
        "Draft replies or announcements in the character counter to verify they fit in one tweet before posting — saving embarrassing mid-word cuts.",
    },
    {
      title: "Brands launching a new X presence",
      description:
        "Use Display Name Ideas to explore creative, on-brand names before committing to one — especially useful when your first choice is already taken.",
    },
  ],

  faqs: [
    {
      q: "How does the Tweet Thread Formatter split content?",
      a: "The formatter splits text at sentence boundaries whenever a segment would exceed the per-tweet character limit (280 characters by default). Each segment is automatically numbered (1/, 2/, 3/) and you can copy the entire thread or individual tweets.",
    },
    {
      q: "What fonts does the Font Preview tool support?",
      a: "It supports a wide range of Unicode-compatible character sets including bold, italic, bold-italic, monospace, script, double-struck, and several decorative styles. All characters are valid Unicode codepoints that render on X without any special app.",
    },
    {
      q: "Does the Character Counter count in the same way as X?",
      a: "Yes. The counter uses the same logic as X's native character counting: URLs count as 23 characters regardless of their actual length, and emoji count as 2 characters. The remaining character display updates in real time.",
    },
    {
      q: "Is my text sent to a server when I use these tools?",
      a: "No. All text processing for these tools (thread splitting, character counting, font conversion, hashtag formatting) happens entirely in your browser. Your text never leaves your device.",
    },
    {
      q: "Can I use the Username Generator for platforms other than X?",
      a: "Yes. The generated usernames follow common handle conventions (short, no spaces, easy to type) so they work well on Instagram, TikTok, YouTube, or any platform that uses @-style handles.",
    },
    {
      q: "What does the Hashtag Formatter actually do?",
      a: "It takes a messy list of hashtags — separated by commas, spaces, or newlines — removes duplicates, ensures each one starts with a single #, fixes spacing, and outputs a clean formatted list ready to paste at the end of your post.",
    },
  ],

  relatedCategories: [
    {
      title: "AI Writing Tools",
      href: "/ai-writing-tools",
      description: "Generate professional X bios and profile copy in seconds with AI.",
      icon: Sparkles,
      color: "text-purple-400",
      bg: "bg-purple-400/10 border-purple-400/20",
    },
    {
      title: "Developer Tools",
      href: "/developer-tools",
      description: "JSON formatter, Base64 encoder, and other browser-based dev utilities.",
      icon: Code2,
      color: "text-orange-400",
      bg: "bg-orange-400/10 border-orange-400/20",
    },
    {
      title: "SEO Tools",
      href: "/seo-tools",
      description: "Meta tag analysis, keyword density checking, and URL slug generation.",
      icon: TrendingUp,
      color: "text-pink-400",
      bg: "bg-pink-400/10 border-pink-400/20",
    },
  ],

  extendedContent: (
    <>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Twitter/X Thread Formatting Guide</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Twitter/X threads are one of the highest-engagement content formats on the platform. A thread is a series of connected tweets posted together, allowing you to share longer-form content in a format that X natively promotes and recommends to users. Threads consistently outperform single tweets in reach, engagement, and follower growth.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">Effective threads follow specific structural patterns: the first tweet (the hook) must be strong enough to make someone want to read more — it should promise specific value, ask a compelling question, or make a surprising claim. Each subsequent tweet should deliver on that promise while maintaining momentum. The last tweet should include a clear call-to-action — a follow prompt, a link to something relevant, or an invitation to reply. Our Thread Formatter handles the mechanical work of splitting long content correctly, so you can focus on the writing.</p>
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Understanding X's 280-Character Limit</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">X's 280-character limit applies to standard accounts posting tweets. The count includes spaces, punctuation, and most Unicode characters. URLs are always counted as 23 characters regardless of actual length (X wraps them in t.co shortened links). Emojis typically count as 2 characters (they use Unicode code points that take 2 characters in Twitter's counting system).</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">X Premium subscribers can post up to 25,000 characters in a single post — effectively removing the character limit. However, long posts are only shown in full to Premium subscribers by default; non-subscribers see a truncated preview with a "Read more" link. For maximum reach to all users, most creators still target 280 characters or use threads. Our Character Counter gives you a real-time count with a visual indicator as you approach the limit.</p>
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Unicode Fonts and X Bio Styling</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Many X bios and tweets include text styled in bold, italic, script, or other decorative fonts — this is achieved using Unicode mathematical letters and special character blocks that render in any Unicode-compliant environment including X's interface. These characters are not actually different fonts; they are distinct Unicode characters that look like styled versions of standard letters.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">Important caveats: Unicode styled text is not searchable (Google and X's search cannot find "𝐁𝐨𝐥𝐝 𝐓𝐞𝐱𝐭" when users search for "Bold Text"). Unicode styled characters may also be inaccessible to screen readers, potentially excluding users who rely on assistive technology. Use styled text sparingly — it is most appropriate for decorative elements like bio styling rather than content you want to be discovered or shared broadly. Our Font Preview tool lets you see all available styles and choose the one that fits your brand.</p>
      </div>
    </>
  ),
};

export default function TextFormatToolsPage() {
  return <CategoryLandingPage config={config} />;
}

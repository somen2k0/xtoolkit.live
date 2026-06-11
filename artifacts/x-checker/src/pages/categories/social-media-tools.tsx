import {
  Users, Search, Link2, AtSign, ShieldCheck, Gauge,
  List, Clock, Sparkles, Type, Code2, TrendingUp,
} from "lucide-react";
import { ALL_TOOLS } from "@/lib/tools-registry";
import { CategoryLandingPage, type CategoryPageConfig } from "./CategoryLandingPage";

const tools = ALL_TOOLS.filter((t) => t.category === "social-media");

const config: CategoryPageConfig = {
  path: "/social-media-tools",
  seoTitle: "Free Social Media Tools for X (Twitter) — Account Checker | X Toolkit",
  seoDescription:
    "Free tools for X (Twitter): bulk account status checker, profile link generator, and @ formatter. Check hundreds of accounts in seconds. No login required.",
  title: "Social Media Tools",
  tagline: "Manage X accounts and profiles at scale — for free",
  description:
    "Professional-grade X (Twitter) account management tools built for creators, agencies, and researchers. Check bulk account status, generate profile links, and format username lists — all without an API key or login.",
  icon: Users,
  color: "text-blue-400",
  bg: "bg-blue-400/10 border-blue-400/20",
  heroGradient: "bg-gradient-to-br from-blue-500/8 via-blue-500/3 to-transparent",
  tools,

  whatIs:
    "Social media tools for X (Twitter) are browser-based utilities that help you manage, audit, and organize accounts at a scale that manual browsing can't match. The Account Checker queries X's public API to tell you in seconds whether any account is active, suspended, or deleted — without you needing to visit each profile individually. The Profile Link Generator instantly converts a raw list of usernames into clickable profile URLs ready to paste into a spreadsheet, email, or report. The @ Formatter handles the tedious job of adding or stripping @ signs from bulk username lists, saving the kind of repetitive work that takes minutes but feels like hours.",

  benefits: [
    {
      icon: Gauge,
      title: "Check up to 100 accounts at once",
      description:
        "Paste a list, press check, get results in under ten seconds — no matter how many usernames you paste.",
    },
    {
      icon: ShieldCheck,
      title: "No API key or login required",
      description:
        "All tools use X's public endpoints via a backend proxy. You never need to authorize an app or share credentials.",
    },
    {
      icon: List,
      title: "Copy-paste workflow",
      description:
        "Input is a plain text list. Output is a formatted table or list you can copy directly into your next task.",
    },
    {
      icon: Clock,
      title: "Results in seconds",
      description:
        "All accounts are checked in parallel. A list of 50 accounts returns results as fast as checking one.",
    },
    {
      icon: Search,
      title: "Accurate status detection",
      description:
        "Distinguishes between active, suspended, and not-found accounts — not just a simple exists/doesn't-exist check.",
    },
    {
      icon: Link2,
      title: "Instant link generation",
      description:
        "Turn a plain username list into a set of clickable profile links formatted for spreadsheets or reports.",
    },
  ],

  useCases: [
    {
      title: "Social media managers auditing influencer lists",
      description:
        "Before a campaign launch, verify which accounts in your influencer spreadsheet are still active and haven't been suspended.",
    },
    {
      title: "Agencies cleaning up client follow lists",
      description:
        "Identify and remove suspended or deleted accounts from a client's follow list in one bulk pass rather than manual review.",
    },
    {
      title: "Researchers tracking X account activity",
      description:
        "Monitor whether accounts in a dataset are still live over time — essential for social media research and journalism.",
    },
    {
      title: "Community managers verifying new followers",
      description:
        "Quickly check if a batch of new followers are real, active accounts or recently created spam.",
    },
    {
      title: "Developers building X-powered applications",
      description:
        "Prototype and test account-status logic without burning rate limits on your own API keys.",
    },
    {
      title: "Users protecting their own network",
      description:
        "Paste your follow list and see at a glance how many accounts have been suspended or deactivated since you followed them.",
    },
  ],

  faqs: [
    {
      q: "How does the Account Checker work without an API key?",
      a: "X Toolkit's backend uses X's public guest token mechanism — the same system X's own web app uses. This gives read-only access to account status data without requiring you to have a developer account or API credentials.",
    },
    {
      q: "How many accounts can I check at once?",
      a: "You can check up to 100 accounts in a single request. All accounts are checked in parallel, so a list of 100 takes roughly the same time as a list of 1.",
    },
    {
      q: "Is the account status information accurate?",
      a: "Yes — the data comes directly from X's API. Active accounts show a green indicator, suspended accounts show red, and usernames that don't exist show as not found. Occasionally, X's API may return an unknown status for accounts that are temporarily restricted; this is noted in the results.",
    },
    {
      q: "Does the tool store my username lists?",
      a: "No. Your input is sent to the backend only to proxy the X API request and is not stored, logged, or retained in any database after the response is returned.",
    },
    {
      q: "What is the @ Formatter used for?",
      a: "When you export usernames from one tool they may include @ signs, and another tool might not accept them — or vice versa. The @ Formatter strips or adds @ prefixes to your entire list in one click so you don't have to edit each line manually.",
    },
    {
      q: "Can I export the results?",
      a: "Yes. The Account Checker results table includes a copy-to-clipboard button that copies all results in a clean, structured format ready to paste into a spreadsheet or document.",
    },
    {
      q: "Does this work for private accounts?",
      a: "The tool can detect that a private account exists and is active. It won't be able to show profile details like avatars or display names for private accounts — only public profile data is accessible.",
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
      title: "Text & Formatting Tools",
      href: "/text-format-tools",
      description: "Format tweet threads, count characters, and preview Unicode fonts.",
      icon: Type,
      color: "text-green-400",
      bg: "bg-green-400/10 border-green-400/20",
    },
    {
      title: "Developer Tools",
      href: "/developer-tools",
      description: "JSON formatter, Base64 encoder, and other browser-based dev utilities.",
      icon: Code2,
      color: "text-orange-400",
      bg: "bg-orange-400/10 border-orange-400/20",
    },
  ],

  extendedContent: (
    <>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">X (Twitter) Account Management at Scale</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">Managing X accounts manually — checking whether accounts are active, building lists of profile links, formatting username lists for outreach tools — is time-consuming and error-prone at scale. Social media managers, growth researchers, and agencies regularly need to audit lists of dozens or hundreds of accounts, and doing this one by one in a browser is not practical.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">Our bulk account checker solves this by letting you paste a list of usernames (or URLs) and checking all of them in a single run. Results show which accounts are active, suspended, or deleted — with export options for using the results in other workflows. The profile link generator converts raw username lists into properly formatted URLs for spreadsheets, reports, and CRM imports. The @ formatter handles the common task of adding or stripping @ prefixes when moving lists between different tools that require different formats.</p>
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Why X Account Status Changes</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">X accounts change status frequently. Accounts can be suspended for violating platform rules (spam, harassment, coordinated inauthentic behavior), deactivated voluntarily by the user, permanently removed by X for severe violations, or temporarily restricted while under review. High-profile accounts are sometimes briefly suspended due to mass false-reporting campaigns before being reinstated.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">For lists built over time — influencer databases, competitor research lists, outreach contact lists — regular auditing is important. A list built 6 months ago may have a 10–20% account status change rate depending on the industry. Our checker gives you an up-to-date status on any list without any API key or authentication required, using X's public profile pages directly.</p>
      </div>
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">X Profile URL Formats Explained</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">X (Twitter) profile URLs follow a simple pattern: <code className="text-xs bg-muted px-1 py-0.5 rounded">https://x.com/username</code>. However, many older links still use the original <code className="text-xs bg-muted px-1 py-0.5 rounded">https://twitter.com/username</code> format, which still redirects correctly to the x.com equivalent. Both formats are functionally identical and reach the same profile.</p>
        <p className="text-sm text-muted-foreground leading-relaxed mt-3">When building lists of profiles for external use — in email campaigns, press kits, spreadsheets, or CRM tools — consistency matters. Our profile link generator lets you choose which URL format to use and applies it uniformly across your entire list, eliminating the mixed formatting that happens when URLs are collected from different sources over time.</p>
      </div>
    </>
  ),
};

export default function SocialMediaToolsPage() {
  return <CategoryLandingPage config={config} />;
}

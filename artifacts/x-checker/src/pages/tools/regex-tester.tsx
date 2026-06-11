import { useState, useMemo } from "react";
import { AdSlot } from "@/components/AdSlot";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { useToolView } from "@/hooks/use-track";
import { Regex, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";

const faqs = [
  { q: "What is a regular expression?", a: "A regular expression (regex) is a sequence of characters that defines a search pattern. Regex is used to match, search, and replace text in strings. It's supported in nearly every programming language." },
  { q: "What flags are available?", a: "Common flags: g (global — find all matches), i (case-insensitive), m (multiline — ^ and $ match line boundaries), s (dotAll — . matches newlines)." },
  { q: "What does \\d, \\w, \\s mean?", a: "\\d matches any digit (0–9). \\w matches any word character (a–z, A–Z, 0–9, _). \\s matches any whitespace character (space, tab, newline). Their uppercase counterparts (\\D, \\W, \\S) match the opposite." },
  { q: "Is my text safe here?", a: "Yes. All regex testing happens entirely in your browser — nothing is sent to a server." },
];

const relatedTools = [
  { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON instantly." },
  { title: "URL Encoder / Decoder", href: "/tools/url-encoder", description: "Encode or decode URLs and query parameters." },
  { title: "Character Counter", href: "/tools/character-counter", description: "Count characters, words, and lines." },
];

const PRESETS = [
  { label: "Email address", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "gi" },
  { label: "URL", pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*", flags: "gi" },
  { label: "Phone number", pattern: "\\+?[1-9]\\d{1,14}", flags: "g" },
  { label: "IPv4 address", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  { label: "Hashtag", pattern: "#[\\w]+", flags: "g" },
  { label: "HTML tag", pattern: "<[^>]+>", flags: "gi" },
  { label: "Digits only", pattern: "\\d+", flags: "g" },
];

const DEFAULT_TEXT = `Welcome to X Toolkit! Visit us at https://xtoolkit.live or email hello@xtoolkit.live for support.
You can also reach us at +1-800-555-0199.
Check out #XToolkit and #DevTools on X (Twitter).
Server IP: 192.168.1.100 | Backup: 10.0.0.1`;

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState(DEFAULT_TEXT);
  useToolView("regex-tester");

  const result = useMemo(() => {
    if (!pattern.trim() || !text) return null;
    try {
      const re = new RegExp(pattern, flags);
      const matches: Array<{ match: string; index: number; groups: Record<string, string> | null }> = [];
      let m: RegExpExecArray | null;
      const testRe = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      while ((m = testRe.exec(text)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.groups ? { ...m.groups } : null });
        if (!flags.includes("g")) break;
      }
      return { ok: true as const, matches, re };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid regex" };
    }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (!result?.ok || result.matches.length === 0) return null;
    const parts: Array<{ text: string; match: boolean }> = [];
    let last = 0;
    for (const { match, index } of result.matches) {
      if (index > last) parts.push({ text: text.slice(last, index), match: false });
      parts.push({ text: match, match: true });
      last = index + match.length;
    }
    if (last < text.length) parts.push({ text: text.slice(last), match: false });
    return parts;
  }, [result, text]);

  const AVAILABLE_FLAGS = ["g", "i", "m", "s"];
  const toggleFlag = (f: string) => {
    setFlags((prev) => prev.includes(f) ? prev.replace(f, "") : prev + f);
  };

  return (
    <MiniToolLayout
      seoTitle="Regex Tester Online — Test & Debug Regular Expressions Instantly | X Toolkit"
      seoDescription="Free online regex tester and debugger. Test regular expressions against any string in real time. Supports JavaScript, Python, and PCRE syntax. No signup required."
      seoKeywords="regex tester, online regex tester, regular expression tester, regex debugger, regex101, test regex online, javascript regex tester, regex matcher online, regex validator, pcre tester, regex pattern tester, regex checker"
      seoOgTitle="Regex Tester Online — Test Regular Expressions Free"
      seoOgDescription="Test and debug regular expressions instantly. Real-time matching, error highlighting, and match details. Free, no signup."
      icon={Regex}
      badge="Developer Tool"
      title="Regex Tester"
      description="Test regular expressions against any text in real time. Matches are highlighted inline. All processing happens in your browser — nothing is sent to a server."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="all"
    >
      <AdSlot slot="top" className="mb-6" />
      <div className="space-y-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Presets</span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setPattern(p.pattern); setFlags(p.flags); }}
                className="text-[11px] px-2.5 py-1 rounded-md bg-muted/60 border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="flex-1 space-y-1.5">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Pattern</label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-mono text-sm shrink-0">/</span>
              <input
                id="regex-pattern"
                name="regex-pattern"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Enter regex pattern..."
                spellCheck={false}
                className={`flex-1 rounded-xl border bg-background/60 px-3 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 transition-all ${
                  result?.ok === false ? "border-destructive/40 focus:ring-destructive/30" : "border-border/60 focus:ring-primary/30"
                }`}
              />
              <span className="text-muted-foreground font-mono text-sm shrink-0">/{flags}</span>
            </div>
            {result?.ok === false && (
              <div className="flex items-center gap-1.5 text-xs text-destructive">
                <XCircle className="h-3.5 w-3.5 shrink-0" />{result.error}
              </div>
            )}
          </div>
          <div className="space-y-1.5 shrink-0">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Flags</label>
            <div className="flex gap-1.5">
              {AVAILABLE_FLAGS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFlag(f)}
                  className={`w-8 h-9 rounded-lg border font-mono text-xs font-bold transition-all ${
                    flags.includes(f) ? "bg-primary text-primary-foreground border-primary" : "bg-muted/40 text-muted-foreground border-border/60 hover:text-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {result?.ok && (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${result.matches.length > 0 ? "bg-green-500/10 border border-green-500/20 text-green-500" : "bg-muted/40 border border-border/50 text-muted-foreground"}`}>
            {result.matches.length > 0 ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> : <XCircle className="h-3.5 w-3.5 shrink-0" />}
            {result.matches.length > 0 ? `${result.matches.length} match${result.matches.length !== 1 ? "es" : ""} found` : "No matches"}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Test String</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            className="w-full min-h-[160px] resize-y rounded-xl border border-border/60 bg-background/60 px-4 py-3.5 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        {highlighted && highlighted.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Matches Highlighted</label>
            <div className="rounded-xl border border-border/60 bg-muted/20 px-4 py-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
              {highlighted.map((part, i) =>
                part.match ? (
                  <mark key={i} className="bg-yellow-400/30 text-yellow-200 rounded px-0.5">{part.text}</mark>
                ) : (
                  <span key={i} className="text-foreground/80">{part.text}</span>
                )
              )}
            </div>
          </div>
        )}

        {result?.ok && result.matches.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Match List</label>
            <div className="rounded-xl border border-border/60 bg-card/40 divide-y divide-border/40 overflow-hidden max-h-48 overflow-y-auto">
              {result.matches.map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2">
                  <span className="text-[10px] font-mono text-muted-foreground/50 w-6 shrink-0">#{i + 1}</span>
                  <code className="text-xs font-mono text-foreground/90 flex-1 break-all">{JSON.stringify(m.match)}</code>
                  <span className="text-[10px] text-muted-foreground/50 shrink-0">idx {m.index}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {[{ icon: ShieldCheck, label: "100% client-side" }, { icon: Regex, label: "Real-time matching" }, { icon: CheckCircle2, label: "Highlight matches" }].map(({ icon: Ic, label }) => (
            <div key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3 py-1">
              <Ic className="h-3 w-3" />{label}
            </div>
          ))}
        </div>

        {/* ── Regex Quick Reference ── */}
        <div className="mt-2 space-y-3">
          <h3 className="text-sm font-semibold text-foreground/80">Regex Quick Reference</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {/* Character classes */}
            <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
              <div className="px-3 py-2 bg-muted/20 border-b border-border/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Character Classes</span>
              </div>
              <div className="divide-y divide-border/30">
                {[
                  { token: "\\d",  desc: "Any digit (0–9)" },
                  { token: "\\D",  desc: "Any non-digit" },
                  { token: "\\w",  desc: "Word char (a–z, A–Z, 0–9, _)" },
                  { token: "\\W",  desc: "Non-word character" },
                  { token: "\\s",  desc: "Whitespace (space, tab, newline)" },
                  { token: "\\S",  desc: "Non-whitespace" },
                  { token: ".",    desc: "Any char except newline" },
                  { token: "[abc]",desc: "One of a, b, or c" },
                  { token: "[^abc]",desc: "Any char not in set" },
                  { token: "[a-z]",desc: "Any lowercase letter" },
                ].map(({ token, desc }) => (
                  <div key={token} className="flex items-center gap-3 px-3 py-1.5 text-xs">
                    <code className="font-mono text-primary/80 shrink-0 w-16">{token}</code>
                    <span className="text-muted-foreground">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Quantifiers & anchors */}
            <div className="space-y-3">
              <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
                <div className="px-3 py-2 bg-muted/20 border-b border-border/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Quantifiers</span>
                </div>
                <div className="divide-y divide-border/30">
                  {[
                    { token: "*",    desc: "0 or more (greedy)" },
                    { token: "+",    desc: "1 or more (greedy)" },
                    { token: "?",    desc: "0 or 1 (optional)" },
                    { token: "{n}",  desc: "Exactly n times" },
                    { token: "{n,m}",desc: "Between n and m times" },
                    { token: "*?",   desc: "0 or more (lazy)" },
                    { token: "+?",   desc: "1 or more (lazy)" },
                  ].map(({ token, desc }) => (
                    <div key={token} className="flex items-center gap-3 px-3 py-1.5 text-xs">
                      <code className="font-mono text-primary/80 shrink-0 w-16">{token}</code>
                      <span className="text-muted-foreground">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
                <div className="px-3 py-2 bg-muted/20 border-b border-border/40">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">Anchors &amp; Groups</span>
                </div>
                <div className="divide-y divide-border/30">
                  {[
                    { token: "^",       desc: "Start of string (or line with m)" },
                    { token: "$",       desc: "End of string (or line with m)" },
                    { token: "\\b",     desc: "Word boundary" },
                    { token: "(abc)",   desc: "Capture group" },
                    { token: "(?:abc)", desc: "Non-capturing group" },
                    { token: "a|b",     desc: "a or b (alternation)" },
                  ].map(({ token, desc }) => (
                    <div key={token} className="flex items-center gap-3 px-3 py-1.5 text-xs">
                      <code className="font-mono text-primary/80 shrink-0 w-20">{token}</code>
                      <span className="text-muted-foreground">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Flags reference */}
          <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
            <div className="px-3 py-2 bg-muted/20 border-b border-border/40">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Flags</span>
            </div>
            <div className="flex flex-wrap divide-x divide-border/30">
              {[
                { flag: "g", name: "Global",      desc: "Find all matches, not just the first" },
                { flag: "i", name: "Ignore case", desc: "Case-insensitive matching" },
                { flag: "m", name: "Multiline",   desc: "^ and $ match each line boundary" },
                { flag: "s", name: "Dot-all",     desc: ". matches newline characters too" },
              ].map(({ flag, name, desc }) => (
                <div key={flag} className="flex-1 min-w-[140px] px-3 py-2.5 text-xs">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <code className="font-mono text-purple-400 font-bold">{flag}</code>
                    <span className="font-medium text-foreground/80">{name}</span>
                  </div>
                  <span className="text-muted-foreground leading-relaxed">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The Regex Tester lets you write, test, and debug regular expressions in real time — with live match highlighting, capture group extraction, and support for all standard JavaScript regex flags (global, case-insensitive, multiline, dotAll, unicode, and sticky).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All processing happens in your browser using JavaScript's built-in RegExp engine — no server round-trips, so it works instantly even on large input strings.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Writing and testing validation patterns for forms or APIs</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Debugging a regex that isn't matching the expected strings</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Extracting capture groups from log files or structured text</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Regex Metacharacters Explained</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Regex patterns are built from a combination of literal characters and metacharacters — special symbols that carry meaning beyond their literal value. Understanding the core metacharacters is the key to reading and writing regular expressions confidently.</p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p><strong className="text-foreground/80">Quantifiers</strong> control how many times the preceding element can match. The asterisk (*) means zero or more, the plus (+) means one or more, and the question mark (?) means zero or one (making the element optional). Adding a curly-brace range like {"{2,5}"} matches a specific count range — "between 2 and 5 times." Appending ? to any quantifier makes it lazy (matches as few characters as possible) rather than greedy (the default, which matches as many as possible).</p>
            <p><strong className="text-foreground/80">Character classes</strong> match any single character from a defined set. Square brackets define a class: [aeiou] matches any vowel. A caret inside the brackets negates it: [^aeiou] matches any character that is not a vowel. Ranges like [a-z] and [0-9] are shorthand for all lowercase letters and all digits respectively. Common shorthand classes include \d (any digit), \w (any word character — letters, digits, underscore), and \s (any whitespace character).</p>
            <p><strong className="text-foreground/80">Anchors and boundaries</strong> match positions rather than characters. The caret (^) anchors the match to the start of the string (or start of each line in multiline mode). The dollar sign ($) anchors to the end. The word boundary \b matches the position between a word character and a non-word character — making it possible to match whole words without matching substrings inside longer words.</p>
            <p><strong className="text-foreground/80">Groups and alternation</strong> are formed with parentheses. A capturing group (pattern) extracts the matched text for use in replacements or programmatic access. A non-capturing group (?:pattern) groups without capturing, useful for applying quantifiers to multiple tokens. The pipe character (|) represents alternation — either the left or right side must match, like (cat|dog) which matches either "cat" or "dog".</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">When to Use Regex vs String Methods</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Regex is a powerful tool but not always the right one. For simple, fixed-string operations — checking if a string starts with a prefix, splitting on a known delimiter, or checking exact equality — plain string methods like includes(), startsWith(), split(), and indexOf() are clearer, faster, and easier to maintain. Regex becomes the right choice when the pattern is variable, when you need to match across multiple formats simultaneously (e.g., phone numbers in 10 different formats), when you need to extract capture groups, or when you're processing large volumes of text and need the expressiveness of pattern matching. Over-using regex for simple string operations is a common source of bugs and maintainability problems — if a string method can solve the problem clearly, prefer it over a complex regular expression.</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Why is my regex matching too much?", a: "This is usually caused by greedy quantifiers. By default, * and + match as many characters as possible. For example, the pattern <.+> applied to <b>hello</b> matches the entire string rather than just <b>. Adding ? after the quantifier (<.+?>) makes it lazy, matching as little as possible. You can also be more explicit about what the quantifier should match: <[^>]+> matches one or more characters that are not >, which is safer for HTML-like patterns." },
              { q: "What is the difference between test() and match() in JavaScript?", a: "test() returns a boolean — true if the pattern matches, false if not. It is the fastest option when you only need to know whether a match exists. match() returns an array of matches (or null if no match), including any captured groups. Use test() for validation and match() when you need to extract the matched text or capture groups." },
              { q: "How do I match a literal dot, asterisk, or other special character?", a: "Escape the special character with a backslash. In a regex, a dot (.) matches any character, but \\. matches only a literal period. Similarly, \\* matches a literal asterisk, \\+ matches a literal plus, and so on. Any of the following characters need escaping when used literally: . * + ? ^ $ { } [ ] | ( ) \\." },
              { q: "What is a lookahead and how do I use it?", a: "A lookahead is a zero-width assertion — it checks what follows the current position without consuming characters. A positive lookahead (?=pattern) asserts that the pattern must follow. A negative lookahead (?!pattern) asserts it must not follow. For example, \\w+(?=\\s) matches a word only when followed by whitespace, without including the whitespace in the match. Lookaheads are commonly used in password validation patterns." },
              { q: "Can I use regex across multiple lines?", a: "By default, the dot (.) does not match newline characters, and ^ and $ match only the start and end of the entire string. Enabling the multiline flag (m) makes ^ and $ match the start and end of each line. Enabling the dotAll flag (s) makes the dot match newline characters too. The tester above supports both flags — enable them in the flags section to test multiline patterns." },
              { q: "How do I make my regex case-insensitive?", a: "Add the case-insensitive flag (i) to your regex. With the i flag, the pattern [a-z] also matches uppercase letters, and specific letters like 'cat' match 'CAT', 'Cat', 'cAt', and all other case combinations. In JavaScript: /pattern/i or new RegExp('pattern', 'i'). The tester above lets you toggle the i flag with a single click." },
            ].map(({ q, a }) => (
              <div key={q} className="space-y-1.5">
                <p className="text-sm font-semibold text-foreground/80">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common Regex Patterns Reference</h2>
          <div className="space-y-4">
            {[
              {
                name: "Email address",
                pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
                desc: "Matches standard email addresses. Validates the local part (letters, numbers, dots, plus, hyphens, underscores), an @ symbol, a domain name, and a top-level domain of at least two characters.",
              },
              {
                name: "URL (http / https)",
                pattern: "https?:\\/\\/[^\\s/$.?#].[^\\s]*",
                desc: "Matches http and https URLs. The ? after 's' makes it optional so both protocols match. Stops at whitespace, making it reliable for extracting URLs from plain text or logs.",
              },
              {
                name: "US phone number",
                pattern: "(\\+1[-.\\s]?)?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}",
                desc: "Matches common US formats including (555) 555-5555, 555-555-5555, and +1 555.555.5555. The optional +1 country code prefix uses a non-capturing group.",
              },
              {
                name: "Date (YYYY-MM-DD)",
                pattern: "\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])",
                desc: "Matches ISO 8601 dates with basic range validation — months 01–12 and days 01–31. Does not validate month-specific day counts (e.g., Feb 30 would still match).",
              },
              {
                name: "Strong password",
                pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}",
                desc: "Uses lookaheads to require at least one lowercase letter, one uppercase letter, one digit, and one special character (@$!%*?&). Enforces a minimum length of 8 characters.",
              },
            ].map(({ name, pattern, desc }) => (
              <div key={name} className="space-y-1.5">
                <div className="flex items-start gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground/80 shrink-0">{name}:</p>
                  <code className="text-xs font-mono bg-muted/60 rounded px-1.5 py-0.5 text-purple-400 break-all">{pattern}</code>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AdSlot slot="bottom" className="mt-6" />
    </MiniToolLayout>
  );
}

import { BlogLayout } from "@/components/layout/BlogLayout";
import { Code, Search, FileText, Braces } from "lucide-react";

export default function WhatIsRegex() {
  return (
    <BlogLayout
      seoTitle="Regular Expressions (Regex) — A Complete Beginner's Guide with Examples (2026)"
      seoDescription="What is regex? A complete beginner's guide to regular expressions with 10 practical examples. Learn syntax, character classes, quantifiers, and how to use regex in JavaScript and Python."
      title="Regular Expressions (Regex) — A Complete Beginner's Guide with Examples"
      description="Regex lets you search, match, and manipulate text using patterns. Here's everything you need to know — from basic syntax to 10 practical real-world examples."
      icon={Code}
      readTime="9 min read"
      publishDate="2026"
      category="Developer"
      relatedArticles={[
        { title: "What Is Base64?", href: "/blog/what-is-base64", description: "Base64 encoding explained for developers.", readTime: "6 min" },
        { title: "What Is a UUID?", href: "/blog/what-is-uuid", description: "UUIDs explained: format, versions, and use cases.", readTime: "6 min" },
        { title: "URL Encoding Guide", href: "/blog/url-encoding-guide", description: "How percent-encoding works in URLs.", readTime: "5 min" },
      ]}
      relatedTools={[
        { title: "Regex Tester", href: "/tools/regex-tester", description: "Test and debug regular expressions in real time.", icon: Search },
        { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON data.", icon: FileText },
        { title: "Case Converter", href: "/tools/case-converter", description: "Convert text between camelCase, snake_case, and more.", icon: Braces },
        { title: "Character Counter", href: "/tools/character-counter", description: "Count characters, words, and lines.", icon: Code },
      ]}
    >
      <h2>What Is a Regular Expression?</h2>
      <p>
        A <strong>regular expression</strong> (shortened to <strong>regex</strong> or <strong>regexp</strong>) is a sequence of characters that defines a search pattern. You use regex to find, match, replace, or validate text. Instead of searching for a fixed string like <code>"hello"</code>, regex lets you describe patterns — like "any word that starts with a capital letter" or "any string that looks like an email address."
      </p>
      <p>
        Regex is supported in virtually every programming language — JavaScript, Python, Java, Go, PHP, Ruby, Rust, and more — as well as in text editors, command-line tools like <code>grep</code> and <code>sed</code>, and databases. Learning regex once means you can apply it everywhere.
      </p>

      <h2>Why Developers Use Regex</h2>
      <p>
        Regex is the right tool when you need to work with text patterns rather than exact strings. Common use cases include:
      </p>
      <ul>
        <li><strong>Validation:</strong> Check whether user input matches a required format (email, phone number, password strength).</li>
        <li><strong>Extraction:</strong> Pull specific pieces of data out of a larger string — like extracting all URLs from a webpage's HTML.</li>
        <li><strong>Search and replace:</strong> Find all occurrences of a pattern and replace them — for example, removing all HTML tags from a string.</li>
        <li><strong>Parsing:</strong> Break structured text into parts — like splitting a log line into timestamp, level, and message.</li>
        <li><strong>Filtering:</strong> Keep only lines that match a pattern, or exclude lines that match.</li>
      </ul>
      <p>
        The alternative to regex — writing custom string manipulation code — is almost always longer, harder to read, and more likely to have edge-case bugs.
      </p>

      <h2>Basic Regex Syntax</h2>
      <p>
        Regex patterns are made up of <strong>literals</strong> (characters that match themselves) and <strong>metacharacters</strong> (characters with special meaning). Here are the fundamental building blocks:
      </p>

      <h3>Character Classes</h3>
      <p>Character classes match one character from a set:</p>
      <ul>
        <li><code>[abc]</code> — matches <code>a</code>, <code>b</code>, or <code>c</code></li>
        <li><code>[a-z]</code> — matches any lowercase letter</li>
        <li><code>[A-Z]</code> — matches any uppercase letter</li>
        <li><code>[0-9]</code> — matches any digit</li>
        <li><code>[^abc]</code> — matches any character that is NOT <code>a</code>, <code>b</code>, or <code>c</code></li>
        <li><code>\d</code> — shorthand for <code>[0-9]</code></li>
        <li><code>\w</code> — shorthand for <code>[a-zA-Z0-9_]</code> (word character)</li>
        <li><code>\s</code> — matches any whitespace character (space, tab, newline)</li>
        <li><code>.</code> — matches any single character except a newline</li>
      </ul>

      <h3>Quantifiers</h3>
      <p>Quantifiers control how many times a pattern must match:</p>
      <ul>
        <li><code>*</code> — zero or more times</li>
        <li><code>+</code> — one or more times</li>
        <li><code>?</code> — zero or one time (makes the preceding element optional)</li>
        <li><code>{"{n}"}</code> — exactly n times</li>
        <li><code>{"{n,}"}</code> — n or more times</li>
        <li><code>{"{n,m}"}</code> — between n and m times</li>
      </ul>

      <h3>Anchors</h3>
      <p>Anchors assert a position rather than matching a character:</p>
      <ul>
        <li><code>^</code> — start of string (or start of line in multiline mode)</li>
        <li><code>$</code> — end of string (or end of line in multiline mode)</li>
        <li><code>\b</code> — word boundary (between a word character and a non-word character)</li>
      </ul>

      <h3>Groups and Alternation</h3>
      <ul>
        <li><code>(abc)</code> — capturing group — matches <code>abc</code> and captures the match</li>
        <li><code>(?:abc)</code> — non-capturing group — groups without capturing</li>
        <li><code>a|b</code> — alternation — matches <code>a</code> or <code>b</code></li>
      </ul>

      <h2>10 Practical Regex Examples</h2>
      <p>Here are real-world patterns you can use directly in your projects:</p>

      <p><strong>1. Email address validation</strong></p>
      <p><code>{`^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$`}</code></p>
      <p>Matches most valid email addresses. Not 100% RFC-compliant, but covers 99%+ of real-world emails.</p>

      <p><strong>2. US phone number (flexible format)</strong></p>
      <p><code>{`^(\\+1[\\s.-]?)?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$`}</code></p>
      <p>Matches formats like <code>555-867-5309</code>, <code>(555) 867-5309</code>, and <code>+1 555 867 5309</code>.</p>

      <p><strong>3. URL matching</strong></p>
      <p><code>{`https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)`}</code></p>
      <p>Matches http and https URLs with optional paths and query strings.</p>

      <p><strong>4. Strong password check</strong></p>
      <p><code>{`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$`}</code></p>
      <p>Requires at least 8 characters, one uppercase, one lowercase, one digit, and one special character.</p>

      <p><strong>5. IP address (IPv4)</strong></p>
      <p><code>{`^((25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$`}</code></p>
      <p>Matches valid IPv4 addresses from <code>0.0.0.0</code> to <code>255.255.255.255</code>.</p>

      <p><strong>6. Hex color code</strong></p>
      <p><code>{`^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$`}</code></p>
      <p>Matches 3-digit and 6-digit hex color codes like <code>#fff</code> and <code>#1a2b3c</code>.</p>

      <p><strong>7. ISO date (YYYY-MM-DD)</strong></p>
      <p><code>{`^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$`}</code></p>
      <p>Matches ISO 8601 date strings. Does not validate day-month combinations (e.g., Feb 31).</p>

      <p><strong>8. Slug (URL-friendly string)</strong></p>
      <p><code>{`^[a-z0-9]+(?:-[a-z0-9]+)*$`}</code></p>
      <p>Matches kebab-case URL slugs: lowercase letters, digits, and hyphens (no leading/trailing hyphens).</p>

      <p><strong>9. Remove HTML tags</strong></p>
      <p><code>{`<[^>]*>`}</code></p>
      <p>Matches any HTML tag. Replace all matches with an empty string to strip HTML from text.</p>

      <p><strong>10. Extract numbers from a string</strong></p>
      <p><code>{`-?\\d+(\\.\\d+)?`}</code></p>
      <p>Matches integers and decimal numbers, including negatives. Use <code>matchAll</code> to extract all numbers from a string.</p>

      <h2>Regex in JavaScript</h2>
      <p>
        JavaScript has built-in regex support via the <code>RegExp</code> object and regex literals. You can write regex inline using forward slashes:
      </p>
      <p><code>{`const emailRegex = /^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$/;`}</code></p>
      <p>
        Key JavaScript regex methods:
      </p>
      <ul>
        <li><code>regex.test(str)</code> — returns <code>true</code> if the pattern matches</li>
        <li><code>str.match(regex)</code> — returns the match (or <code>null</code>)</li>
        <li><code>str.matchAll(regex)</code> — returns an iterator of all matches (requires the <code>g</code> flag)</li>
        <li><code>str.replace(regex, replacement)</code> — replaces the first match (use <code>/g</code> flag for all)</li>
        <li><code>str.split(regex)</code> — splits on the pattern</li>
      </ul>
      <p>
        Regex flags in JavaScript: <code>g</code> (global — find all matches), <code>i</code> (case-insensitive), <code>m</code> (multiline — <code>^</code> and <code>$</code> match line boundaries), <code>s</code> (dotAll — <code>.</code> matches newlines).
      </p>

      <h2>Regex in Python</h2>
      <p>
        Python's <code>re</code> module provides full regex support. Use raw strings (<code>r"..."</code>) to avoid double-escaping backslashes:
      </p>
      <p><code>{`import re\npattern = re.compile(r"^\\d{4}-\\d{2}-\\d{2}$")\nmatch = pattern.match("2026-01-15")`}</code></p>
      <p>
        Key Python regex functions: <code>re.match()</code> (matches from start of string), <code>re.search()</code> (finds first match anywhere), <code>re.findall()</code> (returns all matches as a list), <code>re.sub()</code> (find and replace), <code>re.split()</code> (split on pattern).
      </p>

      <h2>Common Regex Mistakes to Avoid</h2>
      <ul>
        <li><strong>Catastrophic backtracking:</strong> Nested quantifiers like <code>(a+)+</code> can cause exponential slowdowns on certain inputs. Always test with adversarial inputs.</li>
        <li><strong>Greedy vs lazy matching:</strong> By default, quantifiers are greedy (match as much as possible). Add <code>?</code> after a quantifier to make it lazy: <code>.*?</code> matches as little as possible.</li>
        <li><strong>Not escaping special characters:</strong> Characters like <code>.</code>, <code>+</code>, <code>*</code>, <code>?</code>, <code>(</code>, <code>)</code>, <code>[</code>, and <code>{`{`}</code> have special meaning. Use <code>\</code> to match them literally.</li>
        <li><strong>Over-engineering:</strong> For simple string operations, <code>includes()</code>, <code>startsWith()</code>, and <code>split()</code> are faster and more readable than regex.</li>
      </ul>

      <h2>Test Your Regex</h2>
      <p>
        Use our <a href="/tools/regex-tester"><strong>Regex Tester</strong></a> to write and test regular expressions in real time. Paste a pattern, enter test strings, and see matches highlighted instantly — with support for flags and capture groups.
      </p>

      <h2>Regex Syntax Reference</h2>
      <p><strong>Character classes:</strong> <code>[abc]</code> matches a, b, or c. <code>[a-z]</code> matches any lowercase letter. <code>[0-9]</code> matches any digit. <code>[^abc]</code> matches anything except a, b, or c. <code>.</code> (dot) matches any character except newline.</p>
      <p><strong>Quantifiers:</strong> <code>*</code> matches 0 or more. <code>+</code> matches 1 or more. <code>?</code> matches 0 or 1 (optional). <code>{'{n}'}</code> matches exactly n times. <code>{'{n,}'}</code> matches n or more times. <code>{'{n,m}'}</code> matches between n and m times.</p>
      <p><strong>Anchors:</strong> <code>^</code> matches start of string. <code>$</code> matches end of string. <code>\b</code> matches a word boundary. <code>\B</code> matches a non-word boundary.</p>
      <p><strong>Groups and alternation:</strong> <code>(abc)</code> creates a capturing group. <code>(?:abc)</code> is a non-capturing group. <code>a|b</code> matches a or b. <code>\1</code> is a backreference to the first captured group.</p>
      <p><strong>Shorthand classes:</strong> <code>\d</code> matches any digit (same as <code>[0-9]</code>). <code>\w</code> matches any word character (letters, digits, underscore). <code>\s</code> matches any whitespace. Uppercase versions (<code>\D</code>, <code>\W</code>, <code>\S</code>) match the inverse.</p>

      <h2>5 Common Regex Patterns Every Developer Needs</h2>
      <p><strong>1. Email validation:</strong> <code>{'/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/'}</code> — a basic check that the address contains exactly one @ with non-whitespace characters on both sides and a dot in the domain. Note: full RFC 5322 compliance requires a far more complex pattern; this catches common errors.</p>
      <p><strong>2. URL matching:</strong> <code>{'/https?:\\/\\/[^\\s]+'}</code> — matches http:// or https:// followed by any non-whitespace characters. Useful for finding URLs in plain text.</p>
      <p><strong>3. Phone numbers (US):</strong> <code>{'/^\\+?1?[-.\\s]?\\(?[0-9]{3}\\)?[-.\\s]?[0-9]{3}[-.\\s]?[0-9]{4}$/'}</code> — matches common US phone formats including parentheses, dashes, spaces, and an optional +1 country code.</p>
      <p><strong>4. Date format validation (YYYY-MM-DD):</strong> <code>{'/^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$/'}</code> — validates ISO 8601 date format and checks that month is 01–12 and day is 01–31.</p>
      <p><strong>5. Password strength:</strong> <code>{'/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_]).{8,}$/'}</code> — requires at least 8 characters with at least one lowercase letter, one uppercase letter, one digit, and one special character. Uses lookaheads to enforce all conditions simultaneously.</p>
    </BlogLayout>
  );
}

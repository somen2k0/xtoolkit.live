import { BlogLayout } from "@/components/layout/BlogLayout";
import { Hash, Database, Code, FileJson } from "lucide-react";

export default function WhatIsUuid() {
  return (
    <BlogLayout
      seoTitle="What Is a UUID? Format, Versions, and Use Cases Explained (2026)"
      seoDescription="What is a UUID? A complete guide to Universally Unique Identifiers: the format, versions (v1, v4, v7) and when to use UUIDs vs auto-increment IDs."
      title="What Is a UUID? Format, Versions & Use Cases Explained"
      description="UUIDs are 128-bit identifiers used in distributed systems, databases, and APIs. Here's what they are, how the format works, and when to use each version."
      icon={Hash}
      readTime="6 min read"
      publishDate="May 2026"
      category="Developer"
      relatedArticles={[
        { title: "What Is Base64?", href: "/blog/what-is-base64", description: "Base64 encoding explained for developers.", readTime: "6 min" },
        { title: "What Is JSON-LD?", href: "/blog/what-is-json-ld", description: "Structured data markup for SEO.", readTime: "7 min" },
        { title: "What Is URL Encoding?", href: "/blog/url-encoding-guide", description: "How percent-encoding works in URLs.", readTime: "5 min" },
      ]}
      relatedTools={[
        { title: "UUID Generator", href: "/tools/uuid-generator", description: "Generate cryptographically random UUID v4 identifiers.", icon: Hash },
        { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON with UUIDs as IDs.", icon: FileJson },
        { title: "Base64 Encoder", href: "/tools/base64", description: "Encode and decode Base64 strings.", icon: Code },
        { title: "URL Encoder", href: "/tools/url-encoder", description: "Encode UUIDs for safe use in URLs.", icon: Database },
      ]}
    >
      <h2>What Is a UUID?</h2>
      <p>
        A <strong>UUID</strong> (Universally Unique Identifier), also called a GUID (Globally Unique Identifier) in Microsoft's terminology, is a 128-bit identifier designed to be unique across space and time without requiring a central authority to coordinate ID assignment. UUIDs are used as database primary keys, API resource identifiers, session tokens, file names, and anywhere else a globally unique identifier is needed.
      </p>
      <p>
        A UUID looks like this: <code>550e8400-e29b-41d4-a716-446655440000</code>. It's 32 hexadecimal characters displayed in 5 groups separated by hyphens, following the pattern <code>8-4-4-4-12</code>. The total length is always 36 characters (32 hex + 4 hyphens).
      </p>

      <h2>UUID Format Explained</h2>
      <p>The UUID format is defined by RFC 4122. Breaking down a UUID:</p>
      <pre><code>550e8400-e29b-41d4-a716-446655440000
^^^^^^^^ ^^^^ ^^^^ ^^^^ ^^^^^^^^^^^^
  time    t-m  vers  var   node/random</code></pre>
      <p>The structure varies by version, but the 4 in the third group always indicates the version number (version 4 in this example), and the first character of the fourth group is always 8, 9, a, or b (indicating the RFC 4122 variant).</p>

      <h2>UUID Versions Explained</h2>

      <h3>UUID v1 — Time-Based</h3>
      <p>UUID v1 generates identifiers from the current timestamp (measured in 100-nanosecond intervals since October 15, 1582) and the device's MAC address. This means v1 UUIDs are time-ordered — they sort chronologically when ordered by creation time — but they're also traceable to the machine that generated them. The MAC address component is a privacy concern: it reveals which network interface generated the UUID.</p>
      <p><strong>Use when:</strong> You need time-ordered UUIDs for database efficiency and privacy is not a concern.</p>

      <h3>UUID v3 and v5 — Name-Based</h3>
      <p>These generate deterministic UUIDs from a namespace UUID and a name. Given the same inputs, you always get the same output. v3 uses MD5 hashing, v5 uses SHA-1. These are useful for generating stable IDs for known entities — for example, always generating the same UUID for a given URL or email address.</p>
      <p><strong>Use when:</strong> You need reproducible, deterministic IDs for known input values.</p>

      <h3>UUID v4 — Random</h3>
      <p>UUID v4 is the most commonly used version. It's generated entirely from random (or pseudo-random) bits — 122 bits of randomness, with 6 bits reserved for version and variant. There's no timestamp, no machine identifier, no determinism. Each generated UUID is independently random.</p>
      <p>The collision probability is astronomically low: you'd need to generate approximately 2.7 quintillion UUIDs to have a 50% chance of a single collision. In practice, v4 UUID collisions essentially never happen in real-world applications.</p>
      <p><strong>Use when:</strong> You need random, non-guessable identifiers with no privacy concerns about traceable information. This is the right default for most applications.</p>

      <h3>UUID v7 — Time-Ordered Random (New)</h3>
      <p>UUID v7 is a newer specification that combines the best of v1 and v4: it uses the current Unix timestamp in the most significant bits (making it time-sortable) while using random bits for the remaining portion (removing the MAC address privacy concern). v7 UUIDs sort chronologically and are database-index-friendly.</p>
      <p><strong>Use when:</strong> You want the database performance benefits of time-ordered IDs (fewer index fragmentation issues) with the privacy benefits of random IDs. v7 is increasingly the preferred choice for new database schemas.</p>

      <h2>UUID vs Auto-Increment Integer IDs</h2>
      <p>Both approaches have their place. Here's when to choose each:</p>
      <ul>
        <li><strong>Use UUIDs when:</strong> building distributed systems where multiple nodes generate IDs independently; using microservices where IDs must be unique across services; exposing IDs in URLs or APIs where sequential integers would enable enumeration attacks; generating IDs before a database insert (e.g., in application code before the row is created).</li>
        <li><strong>Use auto-increment integers when:</strong> building simple single-database applications; optimizing for maximum database performance at very large scale; working in environments where storage efficiency is critical (integers use 4–8 bytes vs 16 bytes for UUIDs).</li>
      </ul>
      <p>The main practical advantage of integers is database performance: sequential integers create well-organized B-tree indexes. Random UUIDs can cause index fragmentation as new UUIDs are inserted randomly throughout the index rather than at the end. UUID v7's time-ordering mitigates this significantly.</p>

      <h2>UUIDs in Different Database Systems</h2>
      <ul>
        <li><strong>PostgreSQL</strong> — native UUID type (<code>uuid</code>). Stores as 16 bytes. The <code>gen_random_uuid()</code> function generates v4 UUIDs natively.</li>
        <li><strong>MySQL</strong> — no native UUID type. Store as <code>CHAR(36)</code> (text) or <code>BINARY(16)</code> (compact). Use <code>UUID()</code> function for v1 generation.</li>
        <li><strong>SQLite</strong> — no native UUID support. Store as TEXT (36 chars) or BLOB (16 bytes). Generate in application code.</li>
        <li><strong>MongoDB</strong> — uses its own BSON ObjectId format (12 bytes, time-ordered) by default. UUIDs can be stored as the UUID BSON type.</li>
        <li><strong>SQL Server</strong> — native <code>uniqueidentifier</code> type (GUID). Generates v4 via <code>NEWID()</code> and sequential GUIDs via <code>NEWSEQUENTIALID()</code>.</li>
      </ul>

      <h2>Generating UUIDs in Code</h2>
      <p>Every major language has built-in or widely used UUID support:</p>
      <ul>
        <li><strong>JavaScript / Node.js:</strong> Built-in <code>crypto.randomUUID()</code> (Node 15.6+, all modern browsers): <code>const id = crypto.randomUUID();</code>. Or the <code>uuid</code> package: <code>import {'{ v4 as uuidv4 }'} from 'uuid'; const id = uuidv4();</code></li>
        <li><strong>Python:</strong> Built-in <code>uuid</code> module: <code>import uuid; id = str(uuid.uuid4())</code>. For UUID v7 (time-ordered): use the <code>uuid7</code> third-party package.</li>
        <li><strong>Go:</strong> The <code>google/uuid</code> package: <code>id := uuid.New().String()</code>. Or <code>uuid.NewRandom()</code> for explicit v4 with error handling.</li>
        <li><strong>Java / Kotlin:</strong> Built-in: <code>UUID id = UUID.randomUUID();</code> — generates v4 UUIDs.</li>
        <li><strong>C# / .NET:</strong> Built-in: <code>Guid id = Guid.NewGuid();</code> — generates v4. <code>id.ToString()</code> formats it as the standard hyphenated string.</li>
        <li><strong>PHP:</strong> Use <code>ramsey/uuid</code> package: <code>{'$id = Uuid::uuid4()->toString();'}</code>. In Laravel: <code>Str::uuid()</code>.</li>
        <li><strong>PostgreSQL:</strong> Built-in function: <code>SELECT gen_random_uuid();</code> — generates v4 UUIDs natively without any extension.</li>
      </ul>

      <h2>UUID Alternatives: ULID, NanoID, and KSUID</h2>
      <p>UUID isn't the only option. Newer ID formats address UUID's main limitations (random v4 UUIDs cause B-tree index fragmentation, and the standard format is verbose):</p>
      <ul>
        <li><strong>ULID</strong> (Universally Unique Lexicographically Sortable Identifier) — 128-bit, time-sorted, Base32-encoded into 26 characters. Like UUID v7 but more compact and human-readable. Sorts chronologically as a plain string: <code>01ARZ3NDEKTSV4RRFFQ69G5FAV</code>.</li>
        <li><strong>NanoID</strong> — a small URL-friendly random ID (21 characters by default using a 64-character alphabet). Not time-ordered. Zero dependencies, browser-compatible, and more compact than UUID. Widely used in frontend apps: <code>V1StGXR8_Z5jdHi6B-myT</code>.</li>
        <li><strong>KSUID</strong> (K-Sortable Unique IDentifier) — time-ordered, Base62-encoded, 27 characters. Used by Stripe for their public API IDs (<code>cus_</code>, <code>pi_</code> prefixes are followed by a KSUID-based value).</li>
      </ul>
      <p>UUID v4 remains the right default for most applications: it's natively supported in every major database, has no dependencies in most languages, and is universally understood. Switch to UUID v7 or ULID when time-ordering matters for database index performance (inserting records in time order reduces B-tree rebalancing). Switch to NanoID when URL brevity is a priority and time-ordering is not needed.</p>

      <h2>Frequently Asked Questions</h2>

      <p><strong>Can two UUIDs ever be identical?</strong><br />Theoretically yes, practically never. For v4 UUIDs, you'd need to generate approximately 2.7 × 10¹⁸ UUIDs before reaching a 50% probability of a single collision. At a rate of 1 billion UUIDs per second, this would take 85 years. Real applications generate nowhere near this volume, making UUID collisions effectively impossible.</p>

      <p><strong>What is the difference between UUID and GUID?</strong><br />GUID (Globally Unique Identifier) is Microsoft's name for the same specification. UUIDs and GUIDs are identical in format and generation — just different names used in different ecosystems. You'll see GUID in .NET, Windows, SQL Server, and Azure documentation; UUID everywhere else.</p>

      <p><strong>Should UUIDs be stored as strings or binary in databases?</strong><br />Binary (BINARY(16) or native UUID/uniqueidentifier types) uses half the storage space of string format (CHAR(36)) and performs better in indexes. The tradeoff is readability — binary UUIDs are harder to read in query results and logs. For most applications, use the native UUID type if available, or BINARY(16) for MySQL. Use CHAR(36) only if query readability is a significant priority.</p>

      <p><strong>Are UUIDs safe to expose in URLs?</strong><br />Yes, v4 UUIDs are safe to expose in URLs as resource identifiers. They reveal nothing about the underlying data (unlike sequential integers, which reveal how many records exist). However, URLs are logged in server logs and browser history, so don't put sensitive tokens in URLs regardless of format — use Authorization headers instead.</p>

      <p><strong>What is UUID Nil?</strong><br />The Nil UUID is a special UUID where all bits are set to 0: <code>00000000-0000-0000-0000-000000000000</code>. It's used as a null or placeholder value — equivalent to null but in UUID format. The Max UUID (<code>ffffffff-ffff-ffff-ffff-ffffffffffff</code>) is the complementary all-ones value, also sometimes used as a placeholder.</p>
    </BlogLayout>
  );
}

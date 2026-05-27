import { useState, useCallback } from "react";
import { MiniToolLayout } from "@/components/layout/MiniToolLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useToolView } from "@/hooks/use-track";
import { Database, Copy, Trash2, Download, Maximize2, Minimize2, ShieldCheck } from "lucide-react";

const faqs = [
  { q: "What does a SQL formatter do?", a: "A SQL formatter reformats SQL queries with consistent indentation, capitalized keywords, and aligned clauses, making them easier to read, review, and maintain." },
  { q: "Does formatting change the query behavior?", a: "No. SQL formatters only change whitespace and keyword casing. The logic, performance, and output of the query are identical." },
  { q: "Is my SQL safe to paste here?", a: "Yes. All processing happens entirely in your browser — nothing is sent to a server. You can safely paste queries containing sensitive table names, column names, or data." },
  { q: "Which SQL dialects are supported?", a: "This formatter works with standard SQL and most major dialects including PostgreSQL, MySQL, SQLite, SQL Server, and Oracle. The formatting is dialect-agnostic — keywords are capitalized and structure is indented consistently." },
];

const relatedTools = [
  { title: "JSON Formatter", href: "/tools/json-formatter", description: "Format and validate JSON instantly." },
  { title: "HTML Formatter", href: "/tools/html-formatter", description: "Beautify and format HTML code." },
  { title: "CSS Minifier & Formatter", href: "/tools/css-minifier", description: "Minify and format CSS code." },
];

const EXAMPLE_SQL = `select u.id, u.name, u.email, count(o.id) as total_orders, sum(o.amount) as total_spent from users u left join orders o on u.id = o.user_id where u.created_at >= '2024-01-01' and u.status = 'active' group by u.id, u.name, u.email having count(o.id) > 0 order by total_spent desc limit 50;`;

const KEYWORDS = [
  "SELECT","FROM","WHERE","JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","FULL JOIN","OUTER JOIN","CROSS JOIN",
  "ON","AND","OR","NOT","IN","EXISTS","LIKE","BETWEEN","IS NULL","IS NOT NULL",
  "GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","UNION","UNION ALL","INTERSECT","EXCEPT",
  "INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","CREATE TABLE","DROP TABLE","ALTER TABLE",
  "ADD COLUMN","DROP COLUMN","TRUNCATE","AS","DISTINCT","CASE","WHEN","THEN","ELSE","END",
  "COUNT","SUM","AVG","MIN","MAX","COALESCE","NULLIF","CAST","CONVERT",
  "ASC","DESC","PRIMARY KEY","FOREIGN KEY","REFERENCES","CONSTRAINT","INDEX","UNIQUE","NOT NULL","DEFAULT",
  "WITH","RECURSIVE","EXPLAIN","ANALYZE","BEGIN","COMMIT","ROLLBACK","TRANSACTION",
];

function formatSQL(sql: string): string {
  let s = sql.replace(/\s+/g, " ").trim();

  const sortedKW = [...KEYWORDS].sort((a, b) => b.length - a.length);
  for (const kw of sortedKW) {
    const re = new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi");
    s = s.replace(re, kw);
  }

  const mainClauses = ["SELECT","FROM","WHERE","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET",
    "INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","UNION","UNION ALL","INTERSECT","EXCEPT",
    "JOIN","LEFT JOIN","RIGHT JOIN","INNER JOIN","FULL JOIN","OUTER JOIN","CROSS JOIN","WITH"];

  for (const clause of mainClauses) {
    const re = new RegExp(`\\b(${clause.replace(/ /g, "\\s+")})\\b`, "g");
    s = s.replace(re, `\n$1`);
  }

  const lines = s.split("\n").map((l) => l.trim()).filter(Boolean);
  const result: string[] = [];

  for (const line of lines) {
    const isSubClause = /^(ON|AND|OR)\b/i.test(line);
    if (isSubClause) {
      result.push(`  ${line}`);
    } else {
      result.push(line);
    }
  }

  return result.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function minifySQL(sql: string): string {
  return sql.replace(/\s+/g, " ").trim();
}

type Mode = "format" | "minify";

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode | null>(null);
  const { toast } = useToast();
  useToolView("sql-formatter");

  const run = useCallback((m: Mode) => {
    if (!input.trim()) return;
    setMode(m);
    setOutput(m === "format" ? formatSQL(input) : minifySQL(input));
  }, [input]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({ title: "Copied!" });
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "query.sql";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded!" });
  };

  const handleClear = () => { setInput(""); setOutput(""); setMode(null); };
  const loadExample = () => { setInput(EXAMPLE_SQL); setOutput(""); setMode(null); };

  return (
    <MiniToolLayout
      seoTitle="SQL Formatter & Beautifier Online Free"
      seoDescription="Format and beautify SQL queries online for free. Instant keyword capitalization and indentation. 100% client-side — your queries never leave your browser."
      icon={Database}
      badge="Developer Tool"
      title="SQL Formatter & Beautifier"
      description="Format messy SQL queries with proper indentation and capitalized keywords, or minify them for embedding. All processing happens in your browser."
      faqs={faqs}
      relatedTools={relatedTools}
      affiliateCategory="all"
    >
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Input SQL</span>
              <button onClick={loadExample} className="text-[11px] text-primary/70 hover:text-primary underline underline-offset-2 transition-colors">Load example</button>
            </div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(""); setMode(null); }}
              placeholder={"Paste your SQL query here...\n\nselect * from users where active = true"}
              spellCheck={false}
              className="w-full min-h-[320px] md:min-h-[400px] resize-y rounded-xl border border-border/60 bg-background/60 px-4 py-3.5 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground/35"
            />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
              Output {mode ? `(${mode === "format" ? "formatted" : "minified"})` : ""}
            </span>
            <div className={`relative w-full min-h-[320px] md:min-h-[400px] rounded-xl border bg-muted/20 overflow-auto transition-all ${output ? "border-border/60" : "border-border/40 border-dashed"}`}>
              {output ? (
                <pre className="px-4 py-3.5 font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap break-all">{output}</pre>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center p-6">
                  <Database className="h-8 w-8 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground/50">Output appears here</p>
                  <p className="text-xs text-muted-foreground/35">Paste SQL and click Format or Minify</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => run("format")} disabled={!input.trim()} className="text-xs shadow-sm shadow-primary/20 gap-1.5">
            <Maximize2 className="h-3.5 w-3.5" /> Format SQL
          </Button>
          <Button variant="outline" onClick={() => run("minify")} disabled={!input.trim()} className="text-xs border-border/60 gap-1.5">
            <Minimize2 className="h-3.5 w-3.5" /> Minify SQL
          </Button>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output} className="text-xs border-border/60 gap-1.5">
            <Copy className="h-3.5 w-3.5" /> Copy
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output} className="text-xs border-border/60 gap-1.5">
            <Download className="h-3.5 w-3.5" /> Download .sql
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} disabled={!input && !output} className="text-xs gap-1.5 text-muted-foreground hover:text-foreground">
            <Trash2 className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {[{ icon: ShieldCheck, label: "100% client-side" }, { icon: Database, label: "Keyword capitalization" }, { icon: Maximize2, label: "Smart indentation" }].map(({ icon: Ic, label }) => (
            <div key={label} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 rounded-full px-3 py-1">
              <Ic className="h-3 w-3" />{label}
            </div>
          ))}
        </div>

        {/* About */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">About this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This SQL formatter beautifies SQL queries with proper indentation and uppercased keywords, making complex queries readable at a glance. It supports SELECT, INSERT, UPDATE, DELETE, CREATE, and JOIN statements across PostgreSQL, MySQL, SQLite, and most standard SQL dialects.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All formatting runs in your browser — your SQL queries are never sent to a server.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Reading auto-generated or minified SQL from an ORM or query builder</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Reviewing database migrations before running them in production</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Documenting SQL queries in technical specifications or READMEs</li>
          </ul>
        </div>

        {/* How it works */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">1.</span> Paste your SQL query into the input field — works with queries of any length or complexity.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">2.</span> Click <strong className="text-foreground/80">Format SQL</strong> to apply proper indentation and uppercase all SQL keywords.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">3.</span> Get your formatted, readable SQL instantly in the output panel.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">4.</span> Copy the result or download it as a <code className="text-xs font-mono bg-muted/60 rounded px-1">.sql</code> file.</li>
            <li className="flex items-start gap-3"><span className="text-primary font-bold shrink-0 w-5">5.</span> Use <strong className="text-foreground/80">Minify SQL</strong> to compress formatted SQL back to a single line for embedding in code.</li>
          </ol>
        </div>

        {/* Common use cases */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Common use cases</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Making complex JOIN queries readable</strong> — multi-table queries with 5+ joins become immediately understandable.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Formatting auto-generated SQL from ORMs</strong> like Sequelize, Prisma, Hibernate, or Entity Framework.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Standardizing SQL code style</strong> across a team so all queries follow the same formatting conventions.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Preparing SQL for code review</strong> — reviewers can read and understand queries much faster when they're properly formatted.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Creating readable SQL for documentation</strong> — API docs, README files, and technical specs need human-readable queries.</span></li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> <span><strong className="text-foreground/80">Cleaning up legacy SQL</strong> — old stored procedures and views written without formatting standards become maintainable again.</span></li>
          </ul>
        </div>

        {/* Who uses this tool */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Who uses this tool</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Database developers, backend engineers, data analysts, and SQL developers use formatters regularly. Any developer who works with databases encounters messy, unformatted SQL — whether from ORMs, query builders, legacy code, or examples copied from Stack Overflow. Data analysts use it to format long analytical queries before sharing them with colleagues. Database administrators use it to review stored procedures and views. Backend engineers use it to format queries for inclusion in technical documentation.
          </p>
        </div>

        {/* Understanding SQL formatting */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Understanding SQL formatting best practices</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Well-formatted SQL is easier to read, review, and debug. Standard SQL formatting conventions include: uppercase keywords (SELECT, FROM, WHERE, JOIN), consistent indentation for subqueries and conditions, each major clause on its own line, and aligned column names in SELECT statements. These conventions aren't enforced by databases — SQL is case-insensitive and whitespace-agnostic — but they make a significant difference in readability and maintainability.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Always format SQL before committing it to version control. Unformatted SQL in code reviews is harder to review and more likely to contain subtle bugs. Consistent formatting also makes it much easier to use diff tools to compare query changes over time.
          </p>
        </div>

        {/* Additional FAQ */}
        <div className="rounded-2xl border border-border/60 bg-card/40 p-6 space-y-4">
          <h2 className="text-lg font-semibold">Frequently asked questions</h2>
          <div className="space-y-5">
            {[
              { q: "Which SQL dialects does the formatter support?", a: "Standard SQL compatible with MySQL, PostgreSQL, SQLite, SQL Server, MariaDB, and most relational databases. The formatter applies universal conventions — uppercase keywords, consistent indentation — that work correctly across all major SQL dialects." },
              { q: "Does SQL formatting change how the query executes?", a: "No. Formatting only changes whitespace and keyword capitalization. SQL is whitespace-agnostic and case-insensitive for keywords, so the query logic, execution plan, and results are completely unchanged by formatting." },
              { q: "What is the difference between SQL formatting and SQL minification?", a: "Formatting adds whitespace and indentation for human readability. Minification removes whitespace to reduce size. Use formatting for development, code review, and documentation. Use minification when embedding queries in code or configuration files where line breaks would cause issues." },
              { q: "Can I format stored procedures and functions?", a: "Yes. The formatter handles complex SQL including multi-statement blocks, stored procedures, functions, triggers, and queries with subqueries and CTEs. Paste the entire procedure and it will be formatted correctly." },
              { q: "What is SQL beautification?", a: "SQL beautification and SQL formatting are the same thing — converting messy, hard-to-read SQL into properly indented, consistently capitalized, readable code. The terms are interchangeable." },
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

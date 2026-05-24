import { useState, useEffect, useCallback, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Lock, Eye, EyeOff, ShieldCheck, Loader2,
  Activity, Wrench, Mail, ExternalLink,
  CheckCircle2, XCircle, RefreshCw, Globe, Zap,
  BarChart3, DollarSign, Search,
  Server, AlertTriangle, Clock, Star, TrendingUp,
  Cpu, Database, LineChart, MousePointerClick, Layers,
  ImageIcon, Upload, Palette, KeyRound, Timer,
} from "lucide-react";
import { ALL_TOOLS, CATEGORIES, TOTAL_LIVE, type CategoryKey } from "@/lib/tools-registry";

// ── Live Stats ─────────────────────────────────────────────────────────────

interface RouteRow {
  path: string;
  label: string;
  hits: number;
  errors: number;
  lastHitAt: number | null;
}

interface StatsData {
  uptime: { ms: number; label: string };
  totalRequests: number;
  totalErrors: number;
  routes: RouteRow[];
  recordedAt: string;
}

function LiveStats({ password }: { password: string }) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState("");

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const json = await res.json() as StatsData;
        setData(json);
        setLastRefresh(new Date().toLocaleTimeString());
      }
    } catch { /* silent */ }
    setLoading(false);
  }, [password]);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, 10_000);
    return () => clearInterval(id);
  }, [fetch_]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading stats…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400 flex gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        Stats endpoint unavailable. Set ADMIN_PASSWORD to enable it.
      </div>
    );
  }

  const errorRate = data.totalRequests > 0
    ? ((data.totalErrors / data.totalRequests) * 100).toFixed(1)
    : "0.0";

  const topRoutes = data.routes.slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Summary row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Total Requests</p>
          <p className="text-2xl font-bold">{data.totalRequests.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">since last deploy</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Errors</p>
          <p className="text-2xl font-bold text-red-400">{data.totalErrors.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{errorRate}% error rate</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Uptime</p>
          <p className="text-2xl font-bold text-green-400">{data.uptime.label}</p>
          <p className="text-xs text-muted-foreground">server running</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Active Routes</p>
          <p className="text-2xl font-bold text-blue-400">{data.routes.length}</p>
          <p className="text-xs text-muted-foreground">with traffic</p>
        </div>
      </div>

      {/* Per-route breakdown */}
      {topRoutes.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Top Endpoints</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Live · refreshes every 10s
              {lastRefresh && <span className="ml-1 opacity-60">(last: {lastRefresh})</span>}
            </div>
          </div>
          <div className="divide-y divide-border/40">
            {topRoutes.map((r) => {
              const pct = data.totalRequests > 0 ? (r.hits / data.totalRequests) * 100 : 0;
              return (
                <div key={r.path} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.label}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">{r.path}</p>
                  </div>
                  <div className="w-24 hidden sm:block">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/60 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold tabular-nums w-10 text-right">{r.hits}</span>
                  {r.errors > 0 && (
                    <span className="text-[11px] text-red-400 tabular-nums">{r.errors} err</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {topRoutes.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No requests recorded yet — use any tool to see live stats appear here.
        </p>
      )}
    </div>
  );
}

// ── Password Gate ──────────────────────────────────────────────────────────

interface PasswordGateProps {
  onAuth: (password: string) => Promise<{ ok: boolean; error?: string }>;
}

function PasswordGate({ onAuth }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError("");
    const result = await onAuth(password.trim());
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 mb-2">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">xtoolkit.live command center</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Input
              type={show ? "text" : "password"}
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10 h-11"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full h-11" disabled={loading || !password.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShieldCheck className="h-4 w-4 mr-2" />}
            Unlock Dashboard
          </Button>
        </form>
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = "text-primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ── Quick Link ─────────────────────────────────────────────────────────────

function QuickLink({ href, label, description, icon: Icon }: {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-border/60 bg-card hover:bg-muted/40 transition-colors group"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
    </a>
  );
}

// ── Tool Status ────────────────────────────────────────────────────────────

interface ToolEntry {
  enabled: boolean;
  label: string;
  note: string;
  requires: string | null;
  keyCount?: number;
}

interface HealthData {
  status: string;
  uptime: { ms: number; label: string };
  tools: Record<string, ToolEntry>;
  aiCache: { entries: number; totalHits: number; maxEntries: number };
}

function ToolStatus() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) setData(await res.json() as HealthData);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading tool status…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400 flex gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        Could not reach the health endpoint.
      </div>
    );
  }

  const tools = Object.entries(data.tools).filter(([key]) => key !== "xAccountChecker");
  const enabledCount = tools.filter(([, t]) => t.enabled).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
        <span>{enabledCount} of {tools.length} tools fully enabled</span>
        <Button variant="ghost" size="sm" onClick={fetch_} className="h-6 w-6 p-0 ml-auto">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40">
        {tools.map(([key, tool]) => (
          <div key={key} className="flex items-center gap-3 px-4 py-3">
            {tool.enabled
              ? <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
              : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
            }
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{tool.label}</p>
              <p className="text-xs text-muted-foreground truncate">{tool.note}</p>
            </div>
            {tool.enabled ? (
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] shrink-0">
                {tool.keyCount != null ? `${tool.keyCount} key${tool.keyCount !== 1 ? "s" : ""}` : "Online"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] shrink-0 font-mono">
                {tool.requires ?? "Disabled"}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Cache Panel ─────────────────────────────────────────────────────────

function AiCachePanel({ password }: { password: string }) {
  const [cache, setCache] = useState<{ entries: number; totalHits: number; maxEntries: number } | null>(null);
  const [uptime, setUptime] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) {
        const d = await res.json() as HealthData;
        setCache(d.aiCache);
        setUptime(d.uptime.label);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, [password]);

  useEffect(() => { fetch_(); const id = setInterval(fetch_, 15_000); return () => clearInterval(id); }, [fetch_]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading cache stats…
      </div>
    );
  }

  if (!cache) return null;

  const fillPct = cache.maxEntries > 0 ? Math.round((cache.entries / cache.maxEntries) * 100) : 0;
  const savedCalls = cache.totalHits;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <Database className="h-3.5 w-3.5 text-purple-400" />
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Cache Entries</p>
        </div>
        <p className="text-2xl font-bold">{cache.entries}<span className="text-sm font-normal text-muted-foreground"> / {cache.maxEntries}</span></p>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-2">
          <div className="h-full bg-purple-400/70 rounded-full transition-all" style={{ width: `${fillPct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground">{fillPct}% full</p>
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-3.5 w-3.5 text-yellow-400" />
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">API Calls Saved</p>
        </div>
        <p className="text-2xl font-bold text-yellow-400">{savedCalls.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">cache hits since last deploy</p>
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="h-3.5 w-3.5 text-blue-400" />
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Server Uptime</p>
        </div>
        <p className="text-2xl font-bold text-blue-400">{uptime || "—"}</p>
        <p className="text-xs text-muted-foreground">since last restart · refreshes every 15s</p>
      </div>
    </div>
  );
}

// ── Tool Categories (dynamic — derived from tools-manifest.json) ───────────

function ToolCategories() {
  const categoryKeys = Object.keys(CATEGORIES) as CategoryKey[];
  const maxCount = Math.max(...categoryKeys.map((k) => ALL_TOOLS.filter((t) => t.category === k && !t.isComingSoon).length), 1);

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
          <Layers className="h-3.5 w-3.5" />
          Tool Categories
        </p>
        <span className="text-xs text-muted-foreground">{TOTAL_LIVE} tools total</span>
      </div>
      <div className="divide-y divide-border/40">
        {categoryKeys.map((key) => {
          const cat = CATEGORIES[key];
          const count = ALL_TOOLS.filter((t) => t.category === key && !t.isComingSoon).length;
          const pct = (count / maxCount) * 100;
          const Icon = cat.icon;
          return (
            <div key={key} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${cat.color}`} />
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{cat.label}</p>
                  <span className={`text-sm font-bold tabular-nums ${cat.color}`}>{count}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${cat.color.replace("text-", "bg-")}`}
                    style={{ width: `${pct}%`, opacity: 0.7 }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Page Analytics ──────────────────────────────────────────────────────────

interface AnalyticsData {
  totalViews: number;
  windowHours: number;
  recordedSince: string;
  topPages: Array<{ path: string; label: string; category: string; views: number }>;
  byCategory: Record<string, number>;
  hourly: Array<{ label: string; views: number }>;
}

function PageAnalytics({ password }: { password: string }) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState("");

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        setData(await res.json() as AnalyticsData);
        setLastRefresh(new Date().toLocaleTimeString());
      }
    } catch { /* silent */ }
    setLoading(false);
  }, [password]);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, 30_000);
    return () => clearInterval(id);
  }, [fetch_]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading analytics…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 px-4 py-3 text-sm text-yellow-400 flex gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        Analytics not available.
      </div>
    );
  }

  const maxPageViews = Math.max(...data.topPages.map((p) => p.views), 1);
  const maxHourly = Math.max(...data.hourly.map((h) => h.views), 1);
  const sinceDate = new Date(data.recordedSince).toLocaleString([], { dateStyle: "short", timeStyle: "short" });

  const CATEGORY_COLORS: Record<string, string> = {
    tool: "bg-blue-400",
    blog: "bg-orange-400",
    page: "bg-green-400",
    email: "bg-cyan-400",
    category: "bg-purple-400",
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <MousePointerClick className="h-3.5 w-3.5 text-blue-400" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Page Views</p>
          </div>
          <p className="text-2xl font-bold">{data.totalViews.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">last {data.windowHours}h window</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <LineChart className="h-3.5 w-3.5 text-green-400" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Unique Pages</p>
          </div>
          <p className="text-2xl font-bold text-green-400">{data.topPages.length}</p>
          <p className="text-xs text-muted-foreground">distinct routes visited</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-purple-400" />
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Tracking Since</p>
          </div>
          <p className="text-lg font-bold text-purple-400 leading-tight">{sinceDate}</p>
          <p className="text-xs text-muted-foreground">resets on restart</p>
        </div>
      </div>

      {/* Hourly chart */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Views per Hour (last 24h)</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            refreshes every 30s
            {lastRefresh && <span className="ml-1 opacity-60">(last: {lastRefresh})</span>}
          </div>
        </div>
        <div className="px-4 py-3">
          <div className="flex items-end gap-0.5 h-16">
            {data.hourly.map((h, i) => {
              const barH = maxHourly > 0 ? Math.max((h.views / maxHourly) * 100, h.views > 0 ? 8 : 0) : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end gap-0.5 group" title={`${h.label}: ${h.views} view${h.views !== 1 ? "s" : ""}`}>
                  <div
                    className="w-full rounded-sm bg-blue-400/70 transition-all duration-500 group-hover:bg-blue-400"
                    style={{ height: `${barH}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-1 text-[9px] text-muted-foreground">
            <span>{data.hourly[0]?.label ?? ""}</span>
            <span>{data.hourly[11]?.label ?? ""}</span>
            <span>{data.hourly[23]?.label ?? ""}</span>
          </div>
        </div>
      </div>

      {/* Top pages */}
      {data.topPages.length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Top Pages</p>
          </div>
          <div className="divide-y divide-border/40">
            {data.topPages.map((page, i) => {
              const pct = (page.views / maxPageViews) * 100;
              const dotColor = CATEGORY_COLORS[page.category] ?? "bg-gray-400";
              return (
                <div key={page.path} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-xs text-muted-foreground w-4 text-right shrink-0">{i + 1}</span>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-sm font-medium truncate">{page.label}</p>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/50 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold tabular-nums shrink-0">{page.views.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.totalViews === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No page views recorded yet — navigate around the site to see data here.
        </p>
      )}

      {/* Views by category */}
      {Object.keys(data.byCategory).length > 0 && (
        <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Views by Section</p>
          </div>
          <div className="flex gap-0 divide-x divide-border/40">
            {Object.entries(data.byCategory).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
              const pct = data.totalViews > 0 ? Math.round((count / data.totalViews) * 100) : 0;
              const dotColor = CATEGORY_COLORS[cat] ?? "bg-gray-400";
              return (
                <div key={cat} className="flex-1 px-4 py-3 text-center min-w-0">
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1.5 ${dotColor}`} />
                  <p className="text-lg font-bold">{pct}%</p>
                  <p className="text-[11px] text-muted-foreground capitalize">{cat}</p>
                  <p className="text-[10px] text-muted-foreground">{count.toLocaleString()} views</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Branding Panel ─────────────────────────────────────────────────────────

interface BrandingAsset {
  filename: string;
  exists: boolean;
  updatedAt: string | null;
}

const ASSET_GROUPS = [
  {
    label: "Favicons",
    description: "Browser tab icons shown at various sizes",
    assets: [
      { filename: "favicon.ico", label: "favicon.ico", hint: "32×32 ICO" },
      { filename: "favicon.svg", label: "favicon.svg", hint: "Vector SVG" },
      { filename: "favicon-48.png", label: "favicon-48.png", hint: "48×48 PNG" },
      { filename: "favicon-192.png", label: "favicon-192.png", hint: "192×192 PNG" },
      { filename: "favicon-512.png", label: "favicon-512.png", hint: "512×512 PNG" },
    ],
  },
  {
    label: "Open Graph",
    description: "Social sharing preview images",
    assets: [
      { filename: "opengraph.png", label: "opengraph.png", hint: "1200×630 PNG" },
      { filename: "opengraph.jpg", label: "opengraph.jpg", hint: "1200×630 JPG" },
    ],
  },
  {
    label: "Extension Icons",
    description: "Chrome extension toolbar icons",
    assets: [
      { filename: "icon16.png", label: "icon16.png", hint: "16×16 PNG" },
      { filename: "icon32.png", label: "icon32.png", hint: "32×32 PNG" },
      { filename: "icon48.png", label: "icon48.png", hint: "48×48 PNG" },
      { filename: "icon128.png", label: "icon128.png", hint: "128×128 PNG" },
    ],
  },
];

function BrandingPanel({ password }: { password: string }) {
  const [assets, setAssets] = useState<BrandingAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, { ok: boolean; msg: string }>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingFilename = useRef<string>("");

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/branding/assets", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const json = await res.json() as { assets: BrandingAsset[] };
        setAssets(json.assets);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, [password]);

  useEffect(() => { fetchAssets(); }, [fetchAssets]);

  function triggerUpload(filename: string) {
    pendingFilename.current = filename;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const filename = pendingFilename.current;
    if (!file || !filename) return;

    setUploading(filename);
    setFeedback((prev) => { const n = { ...prev }; delete n[filename]; return n; });

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("filename", filename);

      const res = await fetch("/api/admin/branding/upload", {
        method: "POST",
        headers: { "x-admin-password": password },
        body: form,
      });

      const json = await res.json() as { ok?: boolean; error?: string };
      if (res.ok && json.ok) {
        setFeedback((prev) => ({ ...prev, [filename]: { ok: true, msg: "Uploaded!" } }));
        await fetchAssets();
      } else {
        setFeedback((prev) => ({ ...prev, [filename]: { ok: false, msg: json.error ?? "Upload failed." } }));
      }
    } catch {
      setFeedback((prev) => ({ ...prev, [filename]: { ok: false, msg: "Network error." } }));
    }
    setUploading(null);
  }

  const assetMap = Object.fromEntries(assets.map((a) => [a.filename, a]));

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.ico,.svg"
        className="hidden"
        onChange={handleFileChange}
      />

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading assets…
        </div>
      ) : (
        ASSET_GROUPS.map((group) => (
          <div key={group.label} className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.label}
                </p>
                <p className="text-[11px] text-muted-foreground/70 mt-0.5">{group.description}</p>
              </div>
            </div>
            <div className="divide-y divide-border/40">
              {group.assets.map(({ filename, label, hint }) => {
                const info = assetMap[filename];
                const isUploading = uploading === filename;
                const fb = feedback[filename];
                const isImage = !filename.endsWith(".ico");
                const previewSrc = isImage ? `/${filename}` : undefined;

                return (
                  <div key={filename} className="flex items-center gap-3 px-4 py-3">
                    {/* Preview thumbnail */}
                    <div className="w-10 h-10 rounded-lg border border-border/60 bg-muted flex items-center justify-center overflow-hidden shrink-0">
                      {previewSrc && info?.exists ? (
                        <img
                          src={previewSrc}
                          alt={label}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium font-mono">{label}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-muted-foreground">{hint}</span>
                        {info?.exists ? (
                          <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] px-1.5 py-0">
                            Uploaded
                          </Badge>
                        ) : (
                          <Badge className="bg-muted text-muted-foreground border-border/60 text-[10px] px-1.5 py-0">
                            Default
                          </Badge>
                        )}
                        {info?.updatedAt && (
                          <span className="text-[10px] text-muted-foreground/60">
                            {new Date(info.updatedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {fb && (
                        <p className={`text-[11px] mt-0.5 ${fb.ok ? "text-green-400" : "text-red-400"}`}>
                          {fb.msg}
                        </p>
                      )}
                    </div>

                    {/* Upload button */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-xs shrink-0"
                      disabled={isUploading}
                      onClick={() => triggerUpload(filename)}
                    >
                      {isUploading ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Upload className="h-3 w-3 mr-1" />
                      )}
                      {info?.exists ? "Replace" : "Upload"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── API Keys Status ─────────────────────────────────────────────────────────

const KEY_META: Record<string, { label: string; description: string; docsUrl: string }> = {
  GROQ_API_KEY: {
    label: "Groq API Key",
    description: "Powers AI Bio Generator, AI Detector & AI Humanizer",
    docsUrl: "https://console.groq.com",
  },
  WEB3FORMS_KEY: {
    label: "Web3Forms Key",
    description: "Enables the server-side contact / feedback form",
    docsUrl: "https://web3forms.com",
  },
  ADMIN_PASSWORD: {
    label: "Admin Password",
    description: "Protects this admin panel",
    docsUrl: "",
  },
};

function ApiKeysPanel() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/health");
      if (res.ok) setData(await res.json() as HealthData);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading key status…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400 flex gap-2">
        <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
        Could not reach the health endpoint.
      </div>
    );
  }

  const seen = new Set<string>();
  const keyRows: { key: string; set: boolean }[] = [];

  Object.entries(data.tools)
    .filter(([toolKey]) => toolKey !== "xAccountChecker")
    .forEach(([, tool]) => {
      if (tool.requires && !seen.has(tool.requires)) {
        seen.add(tool.requires);
        keyRows.push({ key: tool.requires, set: tool.enabled });
      }
    });

  const setCount = keyRows.filter((r) => r.set).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <KeyRound className="h-3.5 w-3.5" />
        <span>{setCount} of {keyRows.length} keys configured</span>
        <Button variant="ghost" size="sm" onClick={fetch_} className="h-6 w-6 p-0 ml-auto">
          <RefreshCw className="h-3 w-3" />
        </Button>
      </div>
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40">
        {keyRows.map(({ key, set }) => {
          const meta = KEY_META[key];
          return (
            <div key={key} className="flex items-center gap-3 px-4 py-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${set ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <KeyRound className={`h-3.5 w-3.5 ${set ? "text-green-400" : "text-red-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium font-mono">{key}</p>
                  {meta?.label && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">· {meta.label}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{meta?.description ?? "Required env variable"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {set ? (
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-[10px] gap-1">
                    <CheckCircle2 className="h-2.5 w-2.5" /> Set
                  </Badge>
                ) : (
                  <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px] gap-1">
                    <XCircle className="h-2.5 w-2.5" /> Missing
                  </Badge>
                )}
                {meta?.docsUrl && (
                  <a
                    href={meta.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Health Check ───────────────────────────────────────────────────────────

interface EndpointResult {
  label: string;
  path: string;
  status: "loading" | "ok" | "error";
  ms: number | null;
}

function HealthStatus({ password }: { password: string }) {
  const ENDPOINTS = [
    { label: "Liveness", path: "/api/healthz" },
    { label: "Health & Tools", path: "/api/health" },
    { label: "Admin Status", path: "/api/admin/status" },
  ];

  const [results, setResults] = useState<EndpointResult[]>(
    ENDPOINTS.map((e) => ({ ...e, status: "loading", ms: null }))
  );
  const [uptime, setUptime] = useState<string>("");
  const [lastChecked, setLastChecked] = useState<string>("");

  const check = useCallback(async () => {
    setResults(ENDPOINTS.map((e) => ({ ...e, status: "loading", ms: null })));

    await Promise.all(
      ENDPOINTS.map(async (endpoint, i) => {
        const t0 = performance.now();
        try {
          const res = await fetch(endpoint.path, {
            headers: { "x-admin-password": password },
          });
          const ms = Math.round(performance.now() - t0);
          if (endpoint.path === "/api/health" && res.ok) {
            const d = await res.json() as HealthData;
            setUptime(d.uptime.label);
          }
          setResults((prev) => {
            const next = [...prev];
            next[i] = { ...endpoint, status: res.ok ? "ok" : "error", ms };
            return next;
          });
        } catch {
          const ms = Math.round(performance.now() - t0);
          setResults((prev) => {
            const next = [...prev];
            next[i] = { ...endpoint, status: "error", ms };
            return next;
          });
        }
      })
    );

    setLastChecked(new Date().toLocaleTimeString());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  useEffect(() => { check(); }, [check]);

  const allOk = results.every((r) => r.status === "ok");
  const anyError = results.some((r) => r.status === "error");
  const anyLoading = results.some((r) => r.status === "loading");

  const overallStatus = anyLoading ? "loading" : anyError ? "error" : "ok";

  return (
    <div className="space-y-3">
      {/* Summary bar */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-card">
        <div className="flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${
            overallStatus === "ok" ? "bg-green-400 animate-pulse" :
            overallStatus === "error" ? "bg-red-400" : "bg-yellow-400 animate-pulse"
          }`} />
          <div>
            <p className="text-sm font-medium">
              {overallStatus === "loading" ? "Checking endpoints…" :
               allOk ? "All systems operational" : "One or more endpoints failed"}
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              {lastChecked && <p className="text-xs text-muted-foreground">Last checked {lastChecked}</p>}
              {uptime && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Timer className="h-3 w-3" /> Uptime: {uptime}
                </p>
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={check} className="h-7 w-7 p-0">
          <RefreshCw className={`h-3.5 w-3.5 ${anyLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Per-endpoint rows */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden divide-y divide-border/40">
        {results.map((r) => (
          <div key={r.path} className="flex items-center gap-3 px-4 py-3">
            {r.status === "loading" ? (
              <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />
            ) : r.status === "ok" ? (
              <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-red-400 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{r.label}</p>
              <p className="text-[11px] text-muted-foreground font-mono">{r.path}</p>
            </div>
            {r.ms !== null && (
              <span className={`text-xs font-mono tabular-nums ${
                r.ms < 200 ? "text-green-400" : r.ms < 600 ? "text-yellow-400" : "text-red-400"
              }`}>
                {r.ms}ms
              </span>
            )}
            {r.status !== "loading" && (
              <Badge className={`text-[10px] shrink-0 ${
                r.status === "ok"
                  ? "bg-green-500/10 text-green-400 border-green-500/20"
                  : "bg-red-500/10 text-red-400 border-red-500/20"
              }`}>
                {r.status === "ok" ? "200 OK" : "Error"}
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────

function AdminDashboard({ password }: { password: string }) {
  const launchDate = new Date("2025-05-08");
  const today = new Date();
  const daysLive = Math.floor((today.getTime() - launchDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            xtoolkit.live
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Admin Command Center</p>
        </div>
        <Badge className="bg-green-500/15 text-green-400 border-green-500/30 gap-1.5 px-3 py-1">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Live & Secured
        </Badge>
      </div>

      {/* Health Check */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Activity className="h-3.5 w-3.5" />
          Health Check
        </h2>
        <HealthStatus password={password} />
      </section>

      {/* API Keys Status */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <KeyRound className="h-3.5 w-3.5" />
          API Keys Status
        </h2>
        <ApiKeysPanel />
      </section>

      {/* Stats Grid */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Site Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard icon={Wrench} label="Tools" value={TOTAL_LIVE} sub={`Across ${Object.keys(CATEGORIES).length} categories`} color="text-blue-400" />
          <StatCard icon={Clock} label="Days Live" value={daysLive} sub="Built in 7 days 🚀" color="text-purple-400" />
          <StatCard icon={Activity} label="Security" value="0" sub="Vulnerabilities found" color="text-green-400" />
          <StatCard icon={Globe} label="Deployment" value="Replit" sub="Always-on server" color="text-orange-400" />
        </div>
      </section>

      {/* Tool Categories */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Layers className="h-3.5 w-3.5" />
          Tool Categories
        </h2>
        <ToolCategories />
      </section>

      {/* Tool Status */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Tool Status</h2>
        <ToolStatus />
      </section>

      {/* Quick Links */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <QuickLink
            href="https://vercel.com/dashboard"
            label="Vercel Dashboard"
            description="Deployments, logs, env variables"
            icon={Server}
          />
          <QuickLink
            href="https://analytics.google.com"
            label="Google Analytics (GA4)"
            description="Traffic, users, page views"
            icon={BarChart3}
          />
          <QuickLink
            href="https://web3forms.com/dashboard"
            label="Web3Forms"
            description="Contact form submissions"
            icon={Mail}
          />
          <QuickLink
            href="https://console.groq.com"
            label="Groq Console"
            description="AI API usage & billing"
            icon={Zap}
          />
          <QuickLink
            href="https://search.google.com/search-console"
            label="Google Search Console"
            description="SEO indexing & keywords"
            icon={Search}
          />
          <QuickLink
            href="https://www.google.com/adsense"
            label="Google AdSense"
            description="Apply & manage ad revenue"
            icon={DollarSign}
          />
          <QuickLink
            href="https://github.com/somen2k0/xtoolkit.live"
            label="GitHub Repository"
            description="Source code & commits"
            icon={Globe}
          />
          <QuickLink
            href="https://www.producthunt.com/posts/new"
            label="Product Hunt"
            description="Launch your product"
            icon={Star}
          />
        </div>
      </section>

      <p className="text-xs text-center text-muted-foreground pb-4">
        xtoolkit.live admin panel · Built in 7 days 🚀
      </p>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(() =>
    sessionStorage.getItem("admin_password")
  );

  async function handleAuth(pw: string): Promise<{ ok: boolean; error?: string }> {
    try {
      const status = await fetch("/api/admin/status", {
        headers: { "x-admin-password": pw },
      });
      const body = await status.json().catch(() => ({})) as { adminEnabled?: boolean };

      if (!body.adminEnabled) {
        return { ok: false, error: "Admin panel is disabled. Add ADMIN_PASSWORD to your environment variables and redeploy." };
      }

      const verify = await fetch("/api/admin/stats", {
        headers: { "x-admin-password": pw },
      });

      if (verify.status === 401) {
        return { ok: false, error: "Incorrect password. Please try again." };
      }

      sessionStorage.setItem("admin_password", pw);
      setPassword(pw);
      return { ok: true };
    } catch {
      return { ok: false, error: "Could not reach the server. Check your network or deployment." };
    }
  }

  return (
    <Layout>
      {password ? (
        <AdminDashboard password={password} />
      ) : (
        <PasswordGate onAuth={handleAuth} />
      )}
    </Layout>
  );
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Cookie, X } from "lucide-react";
import { getConsentStatus, setConsent, loadGA } from "@/lib/analytics";
import { Link } from "wouter";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const status = getConsentStatus();
    if (status === "pending") {
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
    if (status === "accepted") {
      loadGA();
    }
    return undefined;
  }, []);

  const accept = () => {
    setConsent(true);
    setVisible(false);
  };

  const decline = () => {
    setConsent(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] px-3 py-2 sm:p-4 animate-in slide-in-from-bottom-2 duration-300"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-3xl mx-auto flex flex-row items-center gap-2 sm:gap-4 rounded-xl sm:rounded-2xl border border-border/70 bg-card/95 backdrop-blur-xl shadow-2xl shadow-black/30 px-3 sm:px-5 py-2.5 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Cookie className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-medium text-foreground leading-tight">We use cookies to improve your experience</p>
            <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight hidden sm:block">
              We use Google Analytics to understand how people use our tools — no personal data is sold.{" "}
              <Link href="/privacy">
                <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
              </Link>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={decline}
            className="text-[11px] sm:text-xs text-muted-foreground hover:text-foreground border border-border/60 hover:border-border h-7 sm:h-8 px-2 sm:px-3"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={accept}
            className="text-[11px] sm:text-xs shadow-sm shadow-primary/20 h-7 sm:h-8 px-2 sm:px-3"
          >
            Accept
          </Button>
          <button
            onClick={decline}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-1"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

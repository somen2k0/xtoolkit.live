import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  slot: string;
  format?: "auto" | "horizontal" | "rectangle" | "vertical";
  className?: string;
}

export function AdSlot({ slot, format = "auto", className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (pushed.current) return;
    if (!adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      return;
    }

    const ins = adRef.current;

    const observer = new MutationObserver(() => {
      const status = ins.getAttribute("data-ad-status");
      if (status === "filled") {
        setVisible(true);
      } else if (status === "unfilled") {
        setVisible(false);
      }
    });

    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });

    const timer = setTimeout(() => {
      const status = ins.getAttribute("data-ad-status");
      if (!status || status === "unfilled") setVisible(false);
    }, 3000);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`w-full overflow-hidden transition-all duration-300 ${visible ? "" : "h-0 !m-0 !p-0 opacity-0 pointer-events-none"} ${className}`}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9994285234413878"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}

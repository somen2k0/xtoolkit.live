interface AdSlotProps {
  slot: "top" | "bottom" | "sidebar";
  className?: string;
}

export function AdSlot({ slot, className = "" }: AdSlotProps) {
  const minHeight = slot === "sidebar" ? "250px" : "90px";

  return (
    <div
      data-ad-slot={slot}
      data-ad-status="placeholder"
      style={{ minHeight }}
      className={`w-full ${className}`}
      aria-hidden="true"
    >
      {/* Google AdSense ad will load here */}
    </div>
  );
}

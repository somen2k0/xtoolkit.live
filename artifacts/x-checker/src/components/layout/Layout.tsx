import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col relative overflow-hidden">

      {/* Animated background blobs */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, #F5390A22 0%, transparent 70%)",
            animation: "bg-drift-1 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 -right-48 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #F5390A18 0%, transparent 70%)",
            animation: "bg-drift-2 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-24 left-1/3 w-[450px] h-[450px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #F5C4B530 0%, transparent 70%)",
            animation: "bg-drift-3 26s ease-in-out infinite",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 pb-14 md:pb-0">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

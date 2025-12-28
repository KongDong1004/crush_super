import LotteryGenerator from "@/components/LotteryGenerator";
import SideBanner from "@/components/SideBanner";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex flex-col bg-neutral-950 text-white overflow-hidden relative selection:bg-purple-500/30">

      {/* Background with noise/mesh gradient if desired, or simpler dark bg */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#000] to-[#000]" />

      {/* Stars/Dust effect (simple CSS dots) optional */}
      <div className="fixed inset-0 z-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        <header className="p-6 md:p-8 flex justify-between items-center bg-transparent">
          <div className="text-xl font-bold tracking-tight text-white/80">
            Lucky<span className="text-blue-500">Gen</span>
          </div>
          {/* Optional nav items */}
        </header>

        {/* Main Content Area: Responsive Flex/Grid */}
        <div className="flex-grow flex flex-col 2xl:flex-row items-start justify-center gap-8 p-4 md:p-8 max-w-[1700px] mx-auto w-full">

          {/* Left Side Banner */}
          <SideBanner side="left" />

          {/* Main Generator Section */}
          <div className="flex-grow w-full max-w-5xl">
            <LotteryGenerator />
          </div>

          {/* Right Side Banner */}
          <SideBanner side="right" />
        </div>

        <footer className="p-6 text-center text-white/30 text-sm">
          © {new Date().getFullYear()} Superball. All rights reserved.
        </footer>
      </div>
    </main>
  );
}

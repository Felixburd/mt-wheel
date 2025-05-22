'use client';

import FortuneWheel from '@/components/FortuneWheel';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="h-16 win95-window">
        <div className="win95-title-bar">Wheel of Fortune</div>
      </div>
      
      {/* Main Section */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <FortuneWheel/>
      </main>
      
      {/* Footer */}
      <div className="h-12 win95-window mt-auto">
        <div className="text-center text-sm">© 2025 Mismatchtown</div>
      </div>
    </div>
  );
} 
import type { ReactNode } from "react";

export default function PhoneFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#ece5d6] p-0 md:p-6">
      <div className="relative flex h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden bg-warm-beige md:h-[844px] md:rounded-[42px] md:border-[6px] md:border-deep-forest/90 md:shadow-[0_20px_80px_rgba(0,0,0,0.18)]">
        <div className="absolute left-1/2 top-2 z-50 hidden h-6 w-36 -translate-x-1/2 rounded-full bg-deep-forest md:block" />

        <div className="flex h-10 shrink-0 items-center justify-between px-6">
          <span className="text-xs font-mono font-bold text-deep-forest">
            11:43
          </span>

          <div className="flex items-center gap-2">
            <div className="flex h-2 w-4 overflow-hidden rounded-sm bg-deep-forest/20">
              <div className="h-full w-1/2 bg-deep-forest" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </main>
  );
}
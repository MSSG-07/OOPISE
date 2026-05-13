export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f7f6] text-[#22232a]">
      {/* HERO SECTION */}
      <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 lg:grid-cols-2">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-[#6b665f]">
            Smart Period Pain Triage
          </p>

          <h1 className="max-w-2xl text-5xl font-bold leading-tight md:text-6xl">
            Understand your body with intelligent menstrual health tracking.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#5a544d]">
            Track symptoms, visualize pain patterns, receive wellness guidance,
            and access personalized diet and exercise recommendations based on
            your cycle.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button className="rounded-full bg-[#020104] px-7 py-4 text-white transition hover:opacity-90">
              Start Tracking
            </button>

            <button className="rounded-full border border-[#22232a] px-7 py-4 transition hover:bg-[#ebe9e6]">
              Explore Features
            </button>
          </div>

          {/* QUICK STATS */}
          <div className="mt-12 flex flex-wrap gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-2xl font-bold">AI</p>
              <p className="text-sm text-[#5a544d]">
                Personalized wellness insights
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-2xl font-bold">Offline</p>
              <p className="text-sm text-[#5a544d]">
                Works in low-connectivity areas
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-2xl font-bold">Body Map</p>
              <p className="text-sm text-[#5a544d]">
                Visual pain localization
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT DASHBOARD MOCKUP */}
        <div className="relative">
          <div className="rounded-[32px] bg-white p-6 shadow-2xl">
            
            {/* TOP */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6b665f]">Current Cycle</p>
                <h2 className="text-3xl font-bold">Day 14</h2>
              </div>

              <div className="rounded-full bg-[#f3f2ef] px-4 py-2 text-sm font-medium">
                Medium Risk
              </div>
            </div>

            {/* GRAPH PLACEHOLDER */}
            <div className="mt-8 h-40 rounded-3xl bg-gradient-to-r from-[#d9d4cf] to-[#f1efec]" />

            {/* SYMPTOMS */}
            <div className="mt-8">
              <p className="text-lg font-semibold">Recent Symptoms</p>

              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-[#f3f2ef] px-4 py-2 text-sm">
                  Fatigue
                </span>

                <span className="rounded-full bg-[#f3f2ef] px-4 py-2 text-sm">
                  Cramps
                </span>

                <span className="rounded-full bg-[#f3f2ef] px-4 py-2 text-sm">
                  Back Pain
                </span>

                <span className="rounded-full bg-[#f3f2ef] px-4 py-2 text-sm">
                  Bloating
                </span>
              </div>
            </div>

            {/* WELLNESS CARD */}
            <div className="mt-8 rounded-3xl bg-[#020104] p-6 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-[#d6d2cc]">
                Wellness Guidance
              </p>

              <h3 className="mt-3 text-2xl font-semibold">
                Focus on hydration and light stretching today.
              </h3>

              <p className="mt-3 text-sm text-[#d6d2cc]">
                Suggested: Iron-rich meals, yoga, warm fluids, and reduced
                high-intensity activity.
              </p>
            </div>
          </div>

          {/* FLOATING CARD */}
          <div className="absolute -bottom-6 -left-6 rounded-3xl bg-white p-5 shadow-xl">
            <p className="text-sm text-[#6b665f]">Hydration Goal</p>
            <h3 className="text-2xl font-bold">80%</h3>
          </div>
        </div>
      </section>
    </main>
  );
}
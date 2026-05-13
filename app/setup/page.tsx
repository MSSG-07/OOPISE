"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, User } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { Button, Card } from "@/components/ui";

export default function SetupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [age, setAge] = useState(24);
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(160);
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState(28);
  const [isRegular, setIsRegular] = useState(true);
  const [hasConcerns, setHasConcerns] = useState(false);

  const canContinue =
    name.trim().length > 0 && lastPeriod.trim().length > 0;

  return (
    <PhoneFrame>
      <div className="flex h-full flex-col bg-warm-beige px-6 py-8">
        <div>
          <p className="mb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
            Step 1 of 2
          </p>

          <h1 className="font-heading text-3xl text-deep-forest">
            Fill your wellness profile
          </h1>

          <p className="mt-3 text-sm leading-7 text-dark-tan">
            We personalize your wellness journey based on your cycle.
          </p>
        </div>

        <div className="mt-8 flex-1 space-y-5 overflow-y-auto pb-8">
          <div>
            <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Full Name
            </label>

            <div className="relative">
              <User
                className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray"
                size={18}
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priya Sharma"
                className="w-full rounded-2xl border border-sand bg-white py-4 pl-11 pr-4 outline-none focus:border-sage"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value) || 0)}
                className="w-full rounded-2xl border border-sand bg-white px-4 py-4 outline-none focus:border-sage"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
                Wt (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value) || 0)}
                className="w-full rounded-2xl border border-sand bg-white px-4 py-4 outline-none focus:border-sage"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
                Ht (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value) || 0)}
                className="w-full rounded-2xl border border-sand bg-white px-4 py-4 outline-none focus:border-sage"
              />
            </div>
          </div>

          <Card className="border border-sage/20 bg-sand/80 p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose/15">
                <Calendar className="text-rose" size={22} />
              </div>

              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
                  Last Period
                </p>
                <h3 className="font-heading text-lg text-deep-forest">
                  When did your last period start?
                </h3>
              </div>
            </div>

            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              className="w-full rounded-2xl border border-sand bg-white px-5 py-4 text-deep-forest outline-none transition-all focus:border-sage focus:ring-2 focus:ring-sage/20"
            />

            <p className="mt-3 text-xs leading-6 text-warm-gray">
              This helps us estimate your next cycle phase and provide personalized guidance.
            </p>
          </Card>

          <Card className="border border-sage/20 bg-sand/80 p-4">
            <p className="mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Cycle Length
            </p>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCycleLength(Math.max(15, cycleLength - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
              >
                -
              </button>

              <div className="text-center">
                <p className="font-heading text-4xl text-deep-forest">
                  {cycleLength}
                </p>
                <p className="text-xs text-warm-gray">days</p>
              </div>

              <button
                type="button"
                onClick={() => setCycleLength(Math.min(45, cycleLength + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white"
              >
                +
              </button>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsRegular(true)}
              className={`rounded-[22px] border-2 p-4 text-left transition-all ${
                isRegular ? "border-sage bg-sage/10" : "border-transparent bg-sand"
              }`}
            >
              <p className="font-bold text-deep-forest">Regular cycle</p>
              <p className="mt-1 text-xs text-warm-gray">Follows a pattern</p>
            </button>

            <button
              type="button"
              onClick={() => setIsRegular(false)}
              className={`rounded-[22px] border-2 p-4 text-left transition-all ${
                !isRegular ? "border-sage bg-sage/10" : "border-transparent bg-sand"
              }`}
            >
              <p className="font-bold text-deep-forest">Irregular cycle</p>
              <p className="mt-1 text-xs text-warm-gray">Unpredictable timing</p>
            </button>
          </div>

          <Card className="border border-sage/20 bg-sand/80 p-4">
            <p className="mb-3 text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Concerns
            </p>

            <div className="flex flex-wrap gap-2">
              {["PCOS / PCOD", "Endometriosis", "Heavy Bleeding", "No specific concerns"].map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setHasConcerns(item !== "No specific concerns")}
                    className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                      (hasConcerns && item !== "No specific concerns") ||
                      (!hasConcerns && item === "No specific concerns")
                        ? "bg-primary-forest text-warm-beige"
                        : "bg-warm-beige text-deep-forest"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}
            </div>
          </Card>
        </div>

        <Button
          onClick={() => router.push("/dashboard")}
          disabled={!canContinue}
          className="w-full py-4"
        >
          Continue
        </Button>
      </div>
    </PhoneFrame>
  );
}
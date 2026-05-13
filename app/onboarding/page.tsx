"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Calendar, Heart, Map as MapIcon } from "lucide-react";
import PhoneFrame from "@/components/PhoneFrame";
import { Button } from "@/components/ui";

function OnboardingScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Track your cycle",
      desc: "Log symptoms, flow, and mood in a simple mobile-first flow.",
      icon: <Calendar className="h-10 w-10 text-primary-forest" />,
      color: "bg-mint/40",
    },
    {
      title: "Understand pain patterns",
      desc: "Use the body map to show exactly where discomfort appears.",
      icon: <MapIcon className="h-10 w-10 text-primary-forest" />,
      color: "bg-sage/40",
    },
    {
      title: "Get personalized support",
      desc: "See cycle-aware diet, movement, and wellness guidance.",
      icon: <Heart className="h-10 w-10 text-primary-forest" />,
      color: "bg-rose/40",
    },
  ];

  return (
    <div className="flex h-full w-full flex-col bg-warm-beige px-6 py-8">
      
      {/* CONTENT */}
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        
        <div
          className={`mb-8 flex h-28 w-28 items-center justify-center rounded-[36px] ${slides[step].color}`}
        >
          {slides[step].icon}
        </div>

        <p className="mb-3 text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-warm-gray">
          Step {step + 1} of {slides.length}
        </p>

        <h2 className="max-w-xs font-heading text-3xl leading-tight text-deep-forest">
          {slides[step].title}
        </h2>

        <p className="mt-4 max-w-xs text-sm leading-7 text-dark-tan">
          {slides[step].desc}
        </p>
      </div>

      {/* BOTTOM */}
      <div className="flex flex-col gap-4">
        
        {/* INDICATORS */}
        <div className="flex justify-center gap-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step
                  ? "w-8 bg-primary-forest"
                  : "w-1.5 bg-sand"
              }`}
            />
          ))}
        </div>

        {/* BUTTON */}
        <Button
          onClick={() => {
            if (step < slides.length - 1) {
              setStep(step + 1);
            } else {
              onNext();
            }
          }}
          className="py-4"
        >
          {step === slides.length - 1 ? "Continue" : "Next"}
          <ArrowRight size={18} />
        </Button>

        {/* SKIP */}
        <button
          onClick={onNext}
          className="text-[11px] font-mono uppercase tracking-[0.25em] text-warm-gray"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <PhoneFrame>
      <OnboardingScreen onNext={() => router.push("/setup")} />
    </PhoneFrame>
  );
}
"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import PhoneFrame from "@/components/PhoneFrame";
import { Button } from "@/components/ui";

export default function HomePage() {
  const router = useRouter();

  return (
    <PhoneFrame>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-warm-beige">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-mint/20 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] h-96 w-96 rounded-full bg-sage/10 blur-3xl" />

        <div className="z-10 flex flex-col items-center px-8 text-center">
          <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-[36px] bg-primary-forest shadow-xl shadow-primary-forest/20">
            <Image
              src="/logo.png"
              alt="Oopsie Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>

          <p className="mb-3 text-[10px] font-mono font-bold uppercase tracking-[0.35em] text-primary-forest">
            Welcome to Oopsie
          </p>

          <h1 className="max-w-xs font-heading text-4xl leading-tight tracking-tight text-deep-forest">
            Your cycle, your body, your wellness.
          </h1>

          <p className="mt-5 max-w-[280px] text-sm leading-7 text-dark-tan">
            Track symptoms, understand pain, and receive personalized support
            through every phase of your cycle.
          </p>

          <Button
            onClick={() => router.push("/onboarding")}
            className="mt-10 w-full max-w-[260px] py-4"
          >
            Get Started
          </Button>

          <p className="mt-5 text-[11px] text-warm-gray">
            Private • Personalized • Supportive
          </p>
        </div>
      </div>
    </PhoneFrame>
  );
}
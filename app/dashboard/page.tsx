"use client";
import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import { Button, Card } from "@/components/ui";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  Coffee,
  Droplets,
  Fingerprint,
  Heart,
  Home as HomeIcon,
  LogOut,
  Map as MapIcon,
  MessageCircle,
  Search,
  Settings,
  User,
} from "lucide-react";

type UserData = {
  name: string;
  age: number;
  weight: number;
  height: number;
  cycleLength: number;
  isRegular: boolean;
  hasConcerns: boolean;
};

type Tab = "home" | "log" | "bodymap" | "community" | "insights" | "profile";

function HomeScreen({ userData }: { userData: UserData | null }) {
  const phase = useMemo(() => {
    if (!userData) return "Follicular";
    if (userData.hasConcerns || !userData.isRegular) return "Watch closely";
    return "Follicular";
  }, [userData]);

  const risk = useMemo(() => {
    if (!userData) return "Low";
    if (
      userData.hasConcerns ||
      !userData.isRegular ||
      userData.cycleLength < 21 ||
      userData.cycleLength > 35
    ) {
      return "Medium";
    }
    return "Low";
  }, [userData]);

  return (
    <div className="flex flex-col gap-5 p-5 pb-28">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
            Today
          </p>
          <h2 className="font-heading text-2xl text-deep-forest">
            Hi, {userData?.name || "Priya"}
          </h2>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sand">
          <User className="text-primary-forest" />
        </div>
      </div>

      <Card className="border border-sage/20 bg-sand/90 p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Current phase
            </p>
            <h3 className="mt-1 font-heading text-3xl text-deep-forest">
              {phase}
            </h3>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              risk === "Low"
                ? "bg-sage/20 text-primary-forest"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {risk} risk
          </span>
        </div>

        <div className="mt-5 h-3 rounded-full bg-warm-beige">
          <div className="h-3 w-[52%] rounded-full bg-sage" />
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-warm-gray">
          <span>Day 12 of {userData?.cycleLength || 28}</span>
          <span>Next period in 18 days</span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-white p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-rose/10 text-rose">
            <Droplets size={20} />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
            Flow
          </p>
          <p className="mt-1 text-lg font-bold text-deep-forest">Light</p>
        </Card>

        <Card className="bg-white p-4">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-mint/30 text-primary-forest">
            <Heart size={20} />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
            Mood
          </p>
          <p className="mt-1 text-lg font-bold text-deep-forest">Calm</p>
        </Card>
      </div>

      <Card className="bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Wellness guidance
            </p>
            <h3 className="mt-1 font-heading text-xl text-deep-forest">
              Hydration and gentle movement
            </h3>
          </div>
          <span className="rounded-full bg-mint/30 px-3 py-1 text-xs font-medium text-primary-forest">
            Today
          </span>
        </div>
        <p className="mt-3 text-sm leading-7 text-warm-gray">
          Try warm fluids, light stretching, and iron-rich meals. Keep workouts low-intensity.
        </p>
      </Card>

      <Card className="bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Personalized notes
            </p>
            <h3 className="mt-1 font-heading text-xl text-deep-forest">
              Cycle-aware plan
            </h3>
          </div>
          <Search className="text-warm-gray" size={18} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {["Iron-rich food", "Yoga", "Warm water", "Rest"].map((item) => (
            <span
              key={item}
              className="rounded-full bg-warm-beige px-3 py-2 text-xs text-deep-forest"
            >
              {item}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function LogScreen() {
  return (
    <div className="flex flex-col gap-5 p-5 pb-28">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
          Daily entry
        </p>
        <h2 className="mt-1 font-heading text-2xl text-deep-forest">Log today</h2>
      </div>

      <Card className="bg-white p-4">
        <label className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-dark-tan">
          Pain level
        </label>
        <input
          type="range"
          className="w-full accent-primary-forest"
          min={0}
          max={10}
          defaultValue={4}
        />
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-warm-gray">
          <span>None</span>
          <span>Severe</span>
        </div>
      </Card>

      <div>
        <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
          Symptoms
        </label>
        <input
          placeholder="Cramps, fatigue, bloating"
          className="w-full rounded-2xl border border-sand bg-white px-4 py-4 outline-none focus:border-sage"
        />
      </div>

      <div>
        <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
          Notes
        </label>
        <input
          placeholder="How are you feeling today?"
          className="w-full rounded-2xl border border-sand bg-white px-4 py-4 outline-none focus:border-sage"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {["Cramps", "Headache", "Bloating", "Fatigue", "Back pain", "Nausea"].map((s) => (
          <button
            key={s}
            type="button"
            className="rounded-full bg-sand px-4 py-2 text-xs font-medium text-deep-forest"
          >
            {s}
          </button>
        ))}
      </div>

      <Button className="mt-2 py-4">Save entry</Button>
    </div>
  );
}

function BodyMapScreen() {
  const [selected, setSelected] = useState("Pelvic Area");

  const areas = {
    "Head & Neck": {
      title: "Head & Neck",
      points: ["Headaches", "Migraines", "Neck pain or stiffness", "Tension, heavy feeling"],
    },
    "Shoulders & Upper Back": {
      title: "Shoulders & Upper Back",
      points: ["Muscle tightness", "Soreness", "Stress-related aches"],
    },
    "Chest / Breasts": {
      title: "Chest / Breasts",
      points: ["Tenderness", "Swelling", "Heaviness", "Sensitivity"],
    },
    "Stomach / Digestive Area": {
      title: "Stomach / Digestive Area",
      points: ["Bloating", "Gas pain", "Nausea", "Indigestion", "Cramps, diarrhea or constipation"],
    },
    "Pelvic Area": {
      title: "Pelvic Area",
      points: [
        "Cramps in lower abdomen",
        "Deep pelvic pain",
        "Pressure or heaviness in uterus / bladder area",
        "Ovary area discomfort in PCOS/PCOD",
      ],
    },
    "Legs & Thighs": {
      title: "Legs & Thighs",
      points: ["Aching thighs", "Heavy or tired legs", "Muscle soreness", "Tingling or shooting pain"],
    },
    "Upper & Mid Back": {
      title: "Upper & Mid Back",
      points: ["Dull aching pain", "Tightness", "Sore muscles", "Pain between shoulders"],
    },
    "Lower Back": {
      title: "Lower Back",
      points: ["Dull ache", "Tightness", "Pain that radiates from pelvic area", "Back spasms"],
    },
    "Hips & Groin": {
      title: "Hips & Groin",
      points: ["Deep pelvic pressure", "Hip joint soreness", "Pain during movement or sitting"],
    },
    Buttocks: {
      title: "Buttocks",
      points: ["Dull ache", "Heaviness", "Pelvic pressure during periods"],
    },
    "Calves & Feet": {
      title: "Calves & Feet",
      points: ["Aching calves", "Restless feeling", "Muscle cramps", "Tingling in some people"],
    },
  } as const;

  const selectedData = areas[selected as keyof typeof areas];

  const quickTags = [
    "Cramps / Spasms",
    "Aching / Dull Pain",
    "Pressure / Heaviness",
    "Bloating / Fullness",
    "Tingling / Nerve Pain",
    "General Discomfort",
  ];

  return (
    <div className="flex flex-col gap-5 p-5 pb-28">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
          Body pain map
        </p>
        <h2 className="mt-1 font-heading text-2xl text-deep-forest">
          Tap a body area
        </h2>
        <p className="mt-2 text-sm leading-6 text-dark-tan">
          Use the diagram to mark where discomfort appears during periods or PCOS / PCOD.
        </p>
      </div>

      <Card className="bg-white p-4">
        <div className="relative overflow-hidden rounded-[28px] bg-[#fbf2ef] p-3">
          <div className="mb-3 text-center">
            <p className="font-heading text-lg text-deep-forest">
              Body Pain Map
            </p>
            <p className="text-xs text-warm-gray">
              During Periods & PCOS / PCOD
            </p>
          </div>

          <div className="relative mx-auto h-[720px] w-[320px]">
  <Image
    src="/body-pain-map.png"
    alt="Body pain map"
    fill
    priority
    className="object-contain"
  />

  {/* Head & Neck */}
  <button
    type="button"
    onClick={() => setSelected("Head & Neck")}
    className="absolute left-[34%] top-[13%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 ring-4 ring-white"
  />

  {/* Shoulders & Upper Back */}
  <button
    type="button"
    onClick={() => setSelected("Shoulders & Upper Back")}
    className="absolute left-[22%] top-[31%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 ring-4 ring-white"
  />

  {/* Chest / Breasts */}
  <button
    type="button"
    onClick={() => setSelected("Chest / Breasts")}
    className="absolute left-[32%] top-[41%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-300 ring-4 ring-white"
  />

  {/* Stomach / Digestive Area */}
  <button
    type="button"
    onClick={() => setSelected("Stomach / Digestive Area")}
    className="absolute left-[32%] top-[52%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-300 ring-4 ring-white"
  />

  {/* Pelvic Area */}
  <button
    type="button"
    onClick={() => setSelected("Pelvic Area")}
    className="absolute left-[32%] top-[63%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400 ring-4 ring-white"
  />

  {/* Legs & Thighs */}
  <button
    type="button"
    onClick={() => setSelected("Legs & Thighs")}
    className="absolute left-[31%] top-[79%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500 ring-4 ring-white"
  />

  {/* Upper & Mid Back */}
  <button
    type="button"
    onClick={() => setSelected("Upper & Mid Back")}
    className="absolute right-[12%] top-[33%] h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 ring-4 ring-white"
  />

  {/* Lower Back */}
  <button
    type="button"
    onClick={() => setSelected("Lower Back")}
    className="absolute right-[27%] top-[53%] h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 ring-4 ring-white"
  />

  {/* Hips & Groin */}
  <button
    type="button"
    onClick={() => setSelected("Hips & Groin")}
    className="absolute right-[21%] top-[72%] h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 ring-4 ring-white"
  />

  {/* Buttocks */}
  <button
    type="button"
    onClick={() => setSelected("Buttocks")}
    className="absolute right-[12%] top-[79%] h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500 ring-4 ring-white"
  />

  {/* Calves & Feet */}
  <button
    type="button"
    onClick={() => setSelected("Calves & Feet")}
    className="absolute left-[16%] bottom-[8%] h-5 w-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-violet-300 ring-4 ring-white"
  />
</div>
        </div>
      </Card>

      <Card className="bg-white p-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
          Selected area
        </p>
        <h3 className="mt-1 font-heading text-xl text-deep-forest">
          {selectedData.title}
        </h3>

        <div className="mt-4 flex flex-wrap gap-2">
          {selectedData.points.map((point) => (
            <span
              key={point}
              className="rounded-full bg-warm-beige px-3 py-2 text-xs text-deep-forest"
            >
              {point}
            </span>
          ))}
        </div>
      </Card>

      <Card className="bg-white p-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
          Common pain types
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-sand px-3 py-2 text-xs font-medium text-deep-forest"
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
function CommunityScreen() {
  const posts = [
    {
      user: "Anon42",
      text: "My cramps improved after switching to warm drinks and a lighter workout.",
    },
    {
      user: "CycleTwin",
      text: "Day 1 is usually the hardest for me. Gentle stretching helps a lot.",
    },
    {
      user: "HealthyHer",
      text: "The body map makes it so much easier to explain my pain.",
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 pb-28">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
          Anonymous support
        </p>
        <h2 className="mt-1 font-heading text-2xl text-deep-forest">Community</h2>
      </div>

      {posts.map((post) => (
        <Card key={post.user} className="bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-forest/10 text-xs font-bold text-primary-forest">
              {post.user[0]}
            </div>
            <span className="text-sm font-bold text-deep-forest">{post.user}</span>
          </div>
          <p className="text-sm leading-7 text-warm-gray">{post.text}</p>
        </Card>
      ))}

      <Button className="py-4">Start anonymous post</Button>
    </div>
  );
}

function InsightsScreen({ userData }: { userData: UserData | null }) {
  const irregular =
    userData?.hasConcerns ||
    !userData?.isRegular ||
    (userData?.cycleLength ?? 28) < 21 ||
    (userData?.cycleLength ?? 28) > 35;

  return (
    <div className="flex flex-col gap-5 p-5 pb-28">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
          AI insights
        </p>
        <h2 className="mt-1 font-heading text-2xl text-deep-forest">Trends & guidance</h2>
      </div>

      <Card className={`border ${irregular ? "border-rose/20" : "border-sage/20"} bg-white p-5`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Risk level
            </p>
            <h3 className="mt-1 font-heading text-3xl text-deep-forest">
              {irregular ? "Medium" : "Low"}
            </h3>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              irregular
                ? "bg-amber-100 text-amber-700"
                : "bg-sage/20 text-primary-forest"
            }`}
          >
            {irregular ? "Watch" : "Stable"}
          </span>
        </div>

        <div className="mt-5 h-32 rounded-[24px] bg-sand" />
        <p className="mt-4 text-sm leading-7 text-warm-gray">
          Personalized diet and movement suggestions will update from the form data and cycle tracking.
        </p>
      </Card>

      <Card className="bg-white p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
          Cycle-aware guidance
        </p>
        <div className="mt-3 space-y-3">
          {[
            ["Menstrual", "Warm fluids, rest, iron-rich foods."],
            ["Follicular", "Higher energy, balanced meals, moderate movement."],
            ["Ovulation", "Stay active, hydrate, maintain balance."],
            ["Luteal", "Magnesium-rich foods, calmer workouts."],
          ].map(([phase, desc]) => (
            <div key={phase} className="rounded-2xl bg-warm-beige p-4">
              <p className="font-bold text-deep-forest">{phase}</p>
              <p className="mt-1 text-sm text-warm-gray">{desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ProfileScreen({ userData }: { userData: UserData | null }) {
  return (
    <div className="flex flex-col gap-5 p-5 pb-28">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
          Profile
        </p>
        <h2 className="mt-1 font-heading text-2xl text-deep-forest">
          {userData?.name || "Priya Sharma"}
        </h2>
      </div>

      <Card className="bg-white p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-mint/30">
            <User className="text-primary-forest" />
          </div>
          <div>
            <p className="text-sm font-bold text-deep-forest">Your wellness setup</p>
            <p className="text-xs text-warm-gray">
              Age {userData?.age || 24} • {userData?.weight || 60}kg • {userData?.height || 160}cm
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-white p-4 text-center">
          <Bell className="mx-auto text-primary-forest" />
          <p className="mt-2 text-sm font-bold text-deep-forest">Reminders</p>
        </Card>

        <Card className="bg-white p-4 text-center">
          <Fingerprint className="mx-auto text-primary-forest" />
          <p className="mt-2 text-sm font-bold text-deep-forest">Private</p>
        </Card>
      </div>

      <Card className="bg-white p-4">
        <div className="space-y-3">
          {["Export data", "Language settings", "Privacy lock", "App preferences"].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between rounded-2xl bg-warm-beige p-4"
            >
              <span className="text-sm font-medium text-deep-forest">{item}</span>
              <Settings size={16} className="text-warm-gray" />
            </div>
          ))}
        </div>
      </Card>

      <Button variant="outline" className="border-rose text-rose">
        <LogOut size={16} />
        Logout
      </Button>
    </div>
  );
}

function BottomNav({
  activeTab,
  setActiveTab,
}: {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}) {
  const items: { tab: Tab; icon: ReactNode; label: string }[] = [
    { tab: "home", icon: <HomeIcon size={20} />, label: "Home" },
    { tab: "log", icon: <Calendar size={20} />, label: "Log" },
    { tab: "bodymap", icon: <MapIcon size={20} />, label: "Map" },
    { tab: "community", icon: <MessageCircle size={20} />, label: "Sister" },
    { tab: "insights", icon: <BarChart3 size={20} />, label: "Trend" },
    { tab: "profile", icon: <User size={20} />, label: "Profile" },
  ];

  return (
    <div className="shrink-0 border-t border-deep-forest/10 bg-warm-beige px-2 pb-[calc(env(safe-area-inset-bottom)+4px)] pt-2">
      <div className="grid grid-cols-6 gap-1">
        {items.map((item) => {
          const active = activeTab === item.tab;

          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[10px] transition-all ${
                active ? "text-primary-forest" : "text-warm-gray"
              }`}
            >
              <div
                className={`rounded-full p-2 ${
                  active ? "bg-primary-forest/10" : "bg-transparent"
                }`}
              >
                {item.icon}
              </div>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const userData: UserData = {
    name: "Priya",
    age: 24,
    weight: 60,
    height: 160,
    cycleLength: 28,
    isRegular: true,
    hasConcerns: false,
  };

  return (
    <PhoneFrame>
      <div className="flex h-full min-h-0 flex-col bg-warm-beige">
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeTab === "home" && <HomeScreen userData={userData} />}
          {activeTab === "log" && <LogScreen />}
          {activeTab === "bodymap" && <BodyMapScreen />}
          {activeTab === "community" && <CommunityScreen />}
          {activeTab === "insights" && <InsightsScreen userData={userData} />}
          {activeTab === "profile" && <ProfileScreen userData={userData} />}
        </div>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </PhoneFrame>
  );
}
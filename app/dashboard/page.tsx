"use client";
import Image from "next/image";
import { useMemo, useState, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import PhoneFrame from "@/components/PhoneFrame";
import { Button, Card } from "@/components/ui";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  Download,
  Coffee,
  Eye,
  Droplets,
  Fingerprint,
  Heart,
  Home as HomeIcon,
  Lock,
  LogOut,
  Map as MapIcon,
  MessageCircle,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import {
  addPrediction,
  getAllPredictions,
  getAllLogEntries,
  getModel,
  getUserProfile,
  deleteUserProfile,
  saveUserProfile,
  saveLogEntry,
  saveBodyMapEntry,
  saveCommunityPost,
  getAllCommunityPosts,
  getAllCommunityInteractions,
  saveCommunityInteraction,
  type LogEntry,
  type BodyMapEntry,
  type CommunityPost,
  type CommunityInteraction,
  type CommunityReply,
  type StoredProfile,
} from "@/utils/indexeddb";

type UserData = StoredProfile;

type Tab = "home" | "log" | "bodymap" | "community" | "insights" | "profile";

function HomeScreen({
  userData,
  latestDailyLog,
  theme,
}: {
  userData: UserData | null;
  latestDailyLog: LogEntry | null;
  theme: "light" | "dark";
}) {
  const phaseInfo = useMemo(() => {
    if (!userData) {
      return { phase: "Follicular", dayInCycle: 12, daysToNextPeriod: 16 };
    }

    if (userData.hasConcerns || !userData.isRegular) {
      return { phase: "Watch closely", dayInCycle: null, daysToNextPeriod: null };
    }

    const cycleLength = Math.max(15, userData.cycleLength || 28);
    const lastPeriodDate = userData.lastPeriod ? new Date(userData.lastPeriod) : null;
    const validLastPeriod = lastPeriodDate && !Number.isNaN(lastPeriodDate.getTime());

    if (!validLastPeriod) {
      return { phase: "Follicular", dayInCycle: 12, daysToNextPeriod: 16 };
    }

    const today = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysSinceLastPeriod = Math.max(
      0,
      Math.floor((today.getTime() - lastPeriodDate.getTime()) / msPerDay)
    );
    const dayInCycle = (daysSinceLastPeriod % cycleLength) + 1;

    let phase = "Follicular";
    if (latestDailyLog?.flow && latestDailyLog.flow !== "None" && latestDailyLog.flow !== "Spotting") {
      phase = "Menstrual";
    } else if (dayInCycle <= 5) {
      phase = "Menstrual";
    } else if (dayInCycle <= 13) {
      phase = "Follicular";
    } else if (dayInCycle <= 15) {
      phase = "Ovulation";
    } else {
      phase = "Luteal";
    }

    return {
      phase,
      dayInCycle,
      daysToNextPeriod: cycleLength - dayInCycle,
    };
  }, [userData, latestDailyLog]);

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

  const recommendation = useMemo(() => {
    switch (phaseInfo.phase) {
      case "Menstrual":
        return {
          title: "Pain relief and iron support",
          foods: ["Spinach", "Lentil soup", "Dates", "Ginger tea"],
          yoga: ["Child's Pose", "Cat-Cow", "Supine Twist"],
          note: "Keep meals warm and easy to digest.",
        };
      case "Follicular":
        return {
          title: "Energy build-up and steady protein",
          foods: ["Eggs", "Greek yogurt", "Quinoa", "Berries"],
          yoga: ["Sun Salutation A", "Warrior II", "Cobra Pose"],
          note: "Use this phase for gentle strength and longer sessions.",
        };
      case "Ovulation":
        return {
          title: "Hydration and anti-bloat support",
          foods: ["Cucumber", "Avocado", "Salmon", "Leafy greens"],
          yoga: ["Bridge Pose", "Triangle Pose", "Standing Forward Fold"],
          note: "Focus on mobility and water-rich foods.",
        };
      case "Luteal":
        return {
          title: "Craving control and calm movement",
          foods: ["Oats", "Pumpkin seeds", "Bananas", "Dark chocolate"],
          yoga: ["Butterfly Pose", "Legs-Up-the-Wall", "Seated Forward Fold"],
          note: "Choose magnesium-rich foods and slower stretches.",
        };
      default:
        return {
          title: "Track and rest",
          foods: ["Warm fluids", "Simple rice bowls", "Fruit", "Nuts"],
          yoga: ["Breathing exercises", "Gentle stretching", "Child's Pose"],
          note: "Add your cycle details for a more exact plan.",
        };
    }
  }, [phaseInfo.phase]);

  return (
    <div className={`flex flex-col gap-5 p-5 pb-28 ${theme === "dark" ? "text-slate-100" : ""}`}>
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

      <Card className={`border border-sage/20 p-5 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-sand/90"}`}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Current phase
            </p>
            <h3 className="mt-1 font-heading text-3xl text-deep-forest">
              {phaseInfo.phase}
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
          <span>
            {phaseInfo.dayInCycle ? `Day ${phaseInfo.dayInCycle} of ${userData?.cycleLength || 28}` : `Cycle length ${userData?.cycleLength || 28} days`}
          </span>
          <span>
            {phaseInfo.daysToNextPeriod != null ? `Next period in ${phaseInfo.daysToNextPeriod} days` : "Next period unknown"}
          </span>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className={`p-4 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white"}`}>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-rose/10 text-rose">
            <Droplets size={20} />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
            Flow
          </p>
          <p className="mt-1 text-lg font-bold text-deep-forest">
            {latestDailyLog?.flow || "Not logged"}
          </p>
        </Card>

        <Card className={`p-4 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white"}`}>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-mint/30 text-primary-forest">
            <Heart size={20} />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
            Mood
          </p>
          <p className="mt-1 text-lg font-bold text-deep-forest">
            {latestDailyLog?.mood || "Not logged"}
          </p>
        </Card>
      </div>

      <Card className={`p-5 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Wellness guidance
            </p>
            <h3 className="mt-1 font-heading text-xl text-deep-forest">
              {recommendation.title}
            </h3>
          </div>
          <span className="rounded-full bg-mint/30 px-3 py-1 text-xs font-medium text-primary-forest">
            Today
          </span>
        </div>
        <p className="mt-3 text-sm leading-7 text-warm-gray">{recommendation.note}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-warm-beige p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Exact foods
            </p>
            <ul className="mt-2 space-y-1 text-sm text-deep-forest">
              {recommendation.foods.map((food) => (
                <li key={food}>• {food}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-warm-beige p-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Exact yoga / exercise
            </p>
            <ul className="mt-2 space-y-1 text-sm text-deep-forest">
              {recommendation.yoga.map((pose) => (
                <li key={pose}>• {pose}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

    </div>
  );
}

function LogScreen({ onSaved }: { onSaved: () => void }) {
  const flowOptions = ["None", "Light", "Medium", "Heavy", "Spotting"];
  const moodOptions = ["Calm", "Happy", "Tired", "Irritable", "Anxious", "Low"];
  const [painLevel, setPainLevel] = useState(4);
  const [flow, setFlow] = useState("Light");
  const [mood, setMood] = useState("Calm");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const tags = ["Cramps", "Headache", "Bloating", "Fatigue", "Back pain", "Nausea"];

  async function refreshHistory() {
    try {
      const entries = await getAllLogEntries();
      setHistory(entries);
    } catch {
      setHistory([]);
    }
  }

  useEffect(() => {
    void refreshHistory();
  }, []);

  async function handleSave() {
    const entry: LogEntry = {
      entryType: 'daily',
      dateKey: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      painLevel,
      flow,
      mood,
      symptoms: symptoms.trim(),
      notes: notes.trim(),
      tags: selectedTags,
    };

    try {
      await saveLogEntry(entry);
      setStatus("Entry saved");
      setSymptoms("");
      setNotes("");
      setPainLevel(4);
      setFlow("Light");
      setMood("Calm");
      setSelectedTags([]);
      onSaved();
      await refreshHistory();
    } catch {
      setStatus("Failed to save entry");
    }
  }

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
          Pain level: {painLevel}
        </label>
        <input
          type="range"
          className="w-full accent-primary-forest"
          min={0}
          max={10}
          value={painLevel}
          onChange={(e) => setPainLevel(Number(e.target.value))}
        />
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-widest text-warm-gray">
          <span>None</span>
          <span>Severe</span>
        </div>
      </Card>

      <Card className="bg-white p-4">
        <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-dark-tan">
          Flow today
        </p>
        <div className="flex flex-wrap gap-2">
          {flowOptions.map((option) => {
            const active = flow === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFlow(option)}
                className={`rounded-full px-3 py-2 text-xs font-medium transition-all ${
                  active ? "bg-primary-forest text-warm-beige" : "bg-sand text-deep-forest"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="bg-white p-4">
        <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-dark-tan">
          Mood today
        </p>
        <div className="flex flex-wrap gap-2">
          {moodOptions.map((option) => {
            const active = mood === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setMood(option)}
                className={`rounded-full px-3 py-2 text-xs font-medium transition-all ${
                  active ? "bg-mint/40 text-deep-forest" : "bg-sand text-deep-forest"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </Card>

      <div>
        <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
          Symptoms
        </label>
        <input
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Cramps, fatigue, bloating"
          className="w-full rounded-2xl border border-sand bg-white px-4 py-4 outline-none focus:border-sage"
        />
      </div>

      <div>
        <label className="mb-2 block text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
          Notes
        </label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are you feeling today?"
          className="w-full rounded-2xl border border-sand bg-white px-4 py-4 outline-none focus:border-sage"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setSelectedTags((current) =>
                  current.includes(tag)
                    ? current.filter((item) => item !== tag)
                    : [...current, tag]
                )
              }
              className={`rounded-full px-4 py-2 text-xs font-medium transition-all ${
                active ? "bg-primary-forest text-warm-beige" : "bg-sand text-deep-forest"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <Button className="mt-2 py-4" onClick={handleSave}>
        Save entry
      </Button>

      {status ? <p className="text-sm text-warm-gray">{status}</p> : null}

      <Card className="bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Log history
            </p>
            <h3 className="mt-1 font-heading text-xl text-deep-forest">Your entries</h3>
          </div>
          <span className="rounded-full bg-mint/30 px-3 py-1 text-xs font-medium text-primary-forest">
            {history.length}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-warm-gray">No log entries yet.</p>
          ) : (
            history
              .slice()
              .reverse()
              .map((entry) => (
                <div key={entry.id ?? entry.createdAt} className="rounded-2xl bg-warm-beige p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold text-deep-forest">
                      Pain {entry.painLevel}/10
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-warm-gray">
                      {new Date(entry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {entry.entryType === 'daily' ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                      <span className="rounded-full bg-white px-3 py-1 text-deep-forest">Flow: {entry.flow || '—'}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-deep-forest">Mood: {entry.mood || '—'}</span>
                    </div>
                  ) : null}
                  {entry.symptoms ? <p className="mt-2 text-sm text-warm-gray">Symptoms: {entry.symptoms}</p> : null}
                  {entry.notes ? <p className="mt-1 text-sm text-warm-gray">Notes: {entry.notes}</p> : null}
                  {entry.tags.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white px-3 py-1 text-[11px] text-deep-forest">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))
          )}
        </div>
      </Card>
    </div>
  );
}

function BodyMapScreen() {
  const [selected, setSelected] = useState("Pelvic Area");
  const [markedAreas, setMarkedAreas] = useState<string[]>([]);
  const [selectedPainTypes, setSelectedPainTypes] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

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

          <div className="relative mx-auto h-180 w-[320px]">
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
    className={`absolute left-[25%] top-[22%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Head & Neck") ? "bg-rose-500 scale-125" : "bg-rose-400"
    }`}
  />

  {/* Shoulders & Upper Back */}
  <button
    type="button"
    onClick={() => setSelected("Shoulders & Upper Back")}
    className={`absolute left-[20%] top-[32%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Shoulders & Upper Back") ? "bg-violet-500 scale-125" : "bg-violet-400"
    }`}
  />

  {/* Chest / Breasts */}
  <button
    type="button"
    onClick={() => setSelected("Chest / Breasts")}
    className={`absolute left-[37%] top-[37%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Chest / Breasts") ? "bg-orange-400 scale-125" : "bg-orange-300"
    }`}
  />

  {/* Stomach / Digestive Area */}
  <button
    type="button"
    onClick={() => setSelected("Stomach / Digestive Area")}
    className={`absolute left-[25%] top-[43%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Stomach / Digestive Area") ? "bg-lime-400 scale-125" : "bg-lime-300"
    }`}
  />

  {/* Pelvic Area */}
  <button
    type="button"
    onClick={() => setSelected("Pelvic Area")}
    className={`absolute left-[40%] top-[47%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Pelvic Area") ? "bg-pink-400 scale-125" : "bg-pink-300"
    }`}
  />

  {/* Legs & Thighs */}
  <button
    type="button"
    onClick={() => setSelected("Legs & Thighs")}
    className={`absolute left-[32%] top-[60%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Legs & Thighs") ? "bg-fuchsia-500 scale-125" : "bg-fuchsia-400"
    }`}
  />

  {/* Upper & Mid Back */}
  <button
    type="button"
    onClick={() => setSelected("Upper & Mid Back")}
    className={`absolute right-[20%] top-[33%] h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Upper & Mid Back") ? "bg-violet-500 scale-125" : "bg-violet-400"
    }`}
  />

  {/* Lower Back */}
  <button
    type="button"
    onClick={() => setSelected("Lower Back")}
    className={`absolute right-[27%] top-[44%] h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Lower Back") ? "bg-amber-500 scale-125" : "bg-amber-400"
    }`}
  />

  {/* Hips & Groin */}
  <button
    type="button"
    onClick={() => setSelected("Hips & Groin")}
    className={`absolute left-[28%] top-[48%] h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Hips & Groin") ? "bg-orange-500 scale-125" : "bg-orange-400"
    }`}
  />

  {/* Buttocks */}
  <button
    type="button"
    onClick={() => setSelected("Buttocks")}
    className={`absolute right-[27%] top-[50%] h-6 w-6 translate-x-1/2 -translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Buttocks") ? "bg-fuchsia-500 scale-125" : "bg-fuchsia-400"
    }`}
  />

  {/* Calves & Feet */}
  <button
    type="button"
    onClick={() => setSelected("Calves & Feet")}
    className={`absolute left-[78%] top-[60%] h-6 w-6 -translate-x-1/2 translate-y-1/2 rounded-full ring-4 ring-white transition-all ${
      markedAreas.includes("Calves & Feet") ? "bg-violet-400 scale-125" : "bg-violet-300"
    }`}
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

        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              setMarkedAreas((current) =>
                current.includes(selected)
                  ? current.filter((a) => a !== selected)
                  : [...current, selected]
              );
            }}
          >
            {markedAreas.includes(selected) ? "Unmark" : "Mark area"}
          </Button>
        </div>
      </Card>

      <Card className="bg-white p-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
          Search pain types (multiple choice)
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {quickTags.map((tag) => {
            const active = selectedPainTypes.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setSelectedPainTypes((current) =>
                    current.includes(tag)
                      ? current.filter((item) => item !== tag)
                      : [...current, tag]
                  )
                }
                className={`rounded-full px-3 py-2 text-xs font-medium transition-all ${
                  active ? "bg-primary-forest text-warm-beige" : "bg-sand text-deep-forest"
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-warm-gray">
          Selected: {selectedPainTypes.length}
        </p>
      </Card>

      {(markedAreas.length > 0 || selectedPainTypes.length > 0) && (
        <Card className="bg-white p-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
            Selections
          </p>
          {markedAreas.length > 0 ? (
            <>
              <p className="mt-2 text-xs font-medium text-warm-gray">Marked areas ({markedAreas.length})</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {markedAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full bg-rose/20 px-3 py-2 text-xs font-medium text-deep-forest"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </>
          ) : null}
          {selectedPainTypes.length > 0 ? (
            <>
              <p className="mt-3 text-xs font-medium text-warm-gray">Pain types ({selectedPainTypes.length})</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedPainTypes.map((painType) => (
                  <span
                    key={painType}
                    className="rounded-full bg-mint/40 px-3 py-2 text-xs font-medium text-deep-forest"
                  >
                    {painType}
                  </span>
                ))}
              </div>
            </>
          ) : null}
          {status && <p className="mt-3 text-sm text-warm-gray">{status}</p>}
          <Button
            className="mt-4 w-full"
            onClick={async () => {
              try {
                await saveBodyMapEntry({
                  createdAt: new Date().toISOString(),
                  markedAreas,
                  painTypes: selectedPainTypes,
                });
                setStatus("Marked areas saved");
                setTimeout(() => setStatus(null), 2000);
              } catch {
                setStatus("Failed to save");
              }
            }}
          >
            Save marked areas
          </Button>
        </Card>
      )}
    </div>
  );
}
function CommunityScreen() {
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
  const [interactions, setInteractions] = useState<Record<string, CommunityInteraction>>({});
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [replyTarget, setReplyTarget] = useState<string | null>(null);

  const starterPosts: CommunityPost[] = [
    {
      id: -1,
      user: "Anon42",
      text: "My cramps improved after switching to warm drinks and a lighter workout.",
      createdAt: "2026-05-01T08:00:00.000Z",
      isMine: false,
    },
    {
      id: -2,
      user: "CycleTwin",
      text: "Day 1 is usually the hardest for me. Gentle stretching helps a lot.",
      createdAt: "2026-05-02T08:00:00.000Z",
      isMine: false,
    },
    {
      id: -3,
      user: "HealthyHer",
      text: "The body map makes it so much easier to explain my pain.",
      createdAt: "2026-05-03T08:00:00.000Z",
      isMine: false,
    },
  ];

  const getPostKey = (post: CommunityPost, index: number) =>
    post.id ? `post-${post.id}` : `starter-${index}`;

  async function refreshPosts() {
    try {
      const stored = await getAllCommunityPosts();
      setAllPosts(stored);
    } catch {
      setAllPosts([]);
    }
  }

  async function refreshInteractions() {
    try {
      const stored = await getAllCommunityInteractions();
      const mapped = Object.fromEntries(stored.map((item) => [item.id, item]));
      setInteractions(mapped);
    } catch {
      setInteractions({});
    }
  }

  useEffect(() => {
    void refreshPosts();
    void refreshInteractions();
  }, []);

  const communityPosts = [...starterPosts, ...allPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const myTalks = allPosts.filter((post) => post.isMine);

  async function handlePost() {
    const text = draft.trim();
    if (!text) {
      setStatus("Write something before posting");
      return;
    }

    try {
      await saveCommunityPost({
        user: "Me",
        text,
        createdAt: new Date().toISOString(),
        isMine: true,
      });
      setDraft("");
      setStatus("Posted anonymously");
      await refreshPosts();
    } catch {
      setStatus("Failed to save post");
    }
  }

  async function handleLike(postKey: string) {
    const current = interactions[postKey] ?? { id: postKey, likes: 0, replies: [] };
    const next = { ...current, likes: current.likes + 1 };
    setInteractions((prev) => ({ ...prev, [postKey]: next }));
    await saveCommunityInteraction(next);
  }

  async function handleReply(postKey: string) {
    const text = (replyDrafts[postKey] ?? "").trim();
    if (!text) return;

    const current = interactions[postKey] ?? { id: postKey, likes: 0, replies: [] };
    const reply: CommunityReply = {
      id: `${postKey}-${Date.now()}`,
      user: "Me",
      text,
      createdAt: new Date().toISOString(),
      isMine: true,
    };
    const next = { ...current, replies: [...current.replies, reply] };
    setInteractions((prev) => ({ ...prev, [postKey]: next }));
    setReplyDrafts((prev) => ({ ...prev, [postKey]: "" }));
    setReplyTarget(null);
    await saveCommunityInteraction(next);
  }

  return (
    <div className="flex flex-col gap-5 p-5 pb-28">
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
          Anonymous support
        </p>
        <h2 className="mt-1 font-heading text-2xl text-deep-forest">Community</h2>
      </div>

      <Card className="bg-white p-4">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
          Share a talk
        </p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write anonymously..."
          className="mt-3 min-h-28 w-full rounded-2xl border border-sand bg-white px-4 py-4 text-sm outline-none focus:border-sage"
        />
        {status ? <p className="mt-2 text-sm text-warm-gray">{status}</p> : null}
        <Button className="mt-3 w-full py-4" onClick={handlePost}>
          Post anonymously
        </Button>
      </Card>

      <Card className="bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Community talks
            </p>
            <h3 className="mt-1 font-heading text-xl text-deep-forest">Anonymous feed</h3>
          </div>
          <span className="rounded-full bg-mint/30 px-3 py-1 text-xs font-medium text-primary-forest">
            {communityPosts.length}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {communityPosts.map((post, index) => {
            const postKey = getPostKey(post, index);
            const interaction = interactions[postKey] ?? { id: postKey, likes: 0, replies: [] };

            return (
            <div key={post.id ?? `${post.user}-${post.createdAt}`} className="rounded-2xl bg-warm-beige p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-forest/10 text-xs font-bold text-primary-forest">
                    {post.user[0]}
                  </div>
                  <span className="text-sm font-bold text-deep-forest">{post.user}</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-warm-gray">
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="text-sm leading-7 text-warm-gray">{post.text}</p>
              <div className="mt-3 flex items-center gap-4 text-xs font-medium text-warm-gray">
                <button
                  type="button"
                  onClick={() => handleLike(postKey)}
                  className="inline-flex items-center gap-1 transition-colors hover:text-primary-forest"
                >
                  <span aria-hidden="true">❤️</span>
                  <span>Support</span>
                  <span>({interaction.likes})</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setReplyTarget((current) => (current === postKey ? null : postKey))
                  }
                  className="inline-flex items-center gap-1 transition-colors hover:text-primary-forest"
                >
                  <span aria-hidden="true">💬</span>
                  <span>Reply</span>
                  <span>({interaction.replies.length})</span>
                </button>
              </div>

              {replyTarget === postKey ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={replyDrafts[postKey] ?? ""}
                    onChange={(e) =>
                      setReplyDrafts((current) => ({
                        ...current,
                        [postKey]: e.target.value,
                      }))
                    }
                    placeholder="Write a supportive reply..."
                    className="min-h-20 w-full rounded-xl border border-sand bg-white px-3 py-2 text-sm outline-none focus:border-sage"
                  />
                  <button
                    type="button"
                    onClick={() => handleReply(postKey)}
                    className="text-xs font-medium text-primary-forest hover:underline"
                  >
                    Send reply
                  </button>
                </div>
              ) : null}

              {interaction.replies.length > 0 ? (
                <div className="mt-3 space-y-2 border-t border-white/60 pt-3">
                  {interaction.replies.map((reply) => (
                    <div key={reply.id ?? `${postKey}-${reply.createdAt}`} className="rounded-xl bg-white p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-deep-forest">{reply.user}</span>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-warm-gray">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-warm-gray">{reply.text}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            );
          })}
        </div>
      </Card>

      <Card className="bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              My Talks
            </p>
            <h3 className="mt-1 font-heading text-xl text-deep-forest">My anonymous posts</h3>
          </div>
          <span className="rounded-full bg-rose/20 px-3 py-1 text-xs font-medium text-deep-forest">
            {myTalks.length}
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {myTalks.length === 0 ? (
            <p className="text-sm text-warm-gray">Your talks will appear here after posting.</p>
          ) : (
            myTalks.map((post) => (
              <div key={post.id ?? `${post.user}-${post.createdAt}`} className="rounded-2xl bg-sand p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-bold text-deep-forest">Me</span>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-warm-gray">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
                <p className="text-sm leading-7 text-warm-gray">{post.text}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

function InsightsScreen({ userData }: { userData: UserData | null }) {
  const irregular =
    userData?.hasConcerns ||
    !userData?.isRegular ||
    (userData?.cycleLength ?? 28) < 21 ||
    (userData?.cycleLength ?? 28) > 35;

  const [modelInfo, setModelInfo] = useState<any | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [savedPreds, setSavedPreds] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const savedModel = await getModel("pcos-default");
        setModelInfo(savedModel);
        setStatus(savedModel ? "Loaded saved model" : "No saved model found");
        const preds = (await getAllPredictions()) as any[];
        setSavedPreds(preds || []);
      } catch (e) {
        setStatus("Failed to load saved model or predictions");
      }
    })();
  }, []);

  useEffect(() => {
    if (!modelInfo || !userData || !Array.isArray(modelInfo.weights)) {
      setPrediction(null);
      return;
    }
    const rawClientFeatures = [
      userData.age,
      userData.weight,
      userData.height,
      userData.cycleLength,
      userData.isRegular ? 1 : 0,
      userData.hasConcerns ? 1 : 0,
    ];
    const sizedFeatures = Array.from({ length: modelInfo.weights.length }, (_, index) => {
      return rawClientFeatures[index] ?? 0;
    });
    const normalized = sizedFeatures.map((value, index) => {
      const mean = modelInfo.mean?.[index] ?? 0;
      const std = modelInfo.std?.[index] ?? 1;
      return (value - mean) / (std || 1);
    });
    let z = modelInfo.bias ?? 0;
    for (let index = 0; index < modelInfo.weights.length; index++) {
      z += modelInfo.weights[index] * (normalized[index] ?? 0);
    }
    setPrediction(z >= 0 ? 1 : 0);
  }, [modelInfo, userData]);

  async function handleSavePrediction() {
    if (prediction === null || !userData) {
      setStatus("Prediction is not available");
      return;
    }
    const input = {
      age: userData.age,
      weight: userData.weight,
      height: userData.height,
      cycleLength: userData.cycleLength,
      isRegular: userData.isRegular,
      hasConcerns: userData.hasConcerns,
    };
    const record = { input, prediction, at: new Date().toISOString(), source: "client-info" };
    try {
      await addPrediction(record);
      setSavedPreds((s) => [...s, record]);
      setStatus("Prediction saved");
    } catch (e) {
      setStatus("Failed to save prediction");
    }
  }

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

        <div className="mt-5 h-32 rounded-3xl bg-sand" />
        <p className="mt-4 text-sm leading-7 text-warm-gray">
          Personalized diet and movement suggestions will update from the form data and cycle tracking.
        </p>
      </Card>

      <Card className="bg-white p-5">
        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">PCOS prediction (client)</p>
        <div className="mt-3 space-y-3">
          <div className="text-sm text-warm-gray">{status}</div>
          <div className="mt-3">
            <p className="font-bold">Prediction from your information</p>
            <p className="text-sm">
              {prediction === null ? "Unavailable" : prediction === 1 ? "Higher PCOS risk" : "Lower PCOS risk"}
            </p>
            <Button className="mt-3" onClick={handleSavePrediction}>Save prediction</Button>
          </div>

          <div className="mt-3">
            <p className="font-bold">Saved predictions</p>
            <div className="space-y-2 mt-2">
              {savedPreds.map((p, i) => (
                <div key={i} className="rounded p-2 bg-warm-beige text-sm">
                  <div>Input: {JSON.stringify(p.input)}</div>
                  <div>Pred: {String(p.prediction)}</div>
                  <div className="text-xs text-warm-gray">{p.at}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function ProfileScreen({
  userData,
  theme,
  onThemeChange,
  onProfileSaved,
  onLogout,
}: {
  userData: UserData | null;
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
  onProfileSaved: (profile: UserData) => void;
  onLogout: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userData?.name || "");
  const [age, setAge] = useState(String(userData?.age || 24));
  const [weight, setWeight] = useState(String(userData?.weight || 60));
  const [height, setHeight] = useState(String(userData?.height || 160));
  const [lastPeriod, setLastPeriod] = useState(userData?.lastPeriod || "");
  const [cycleLength, setCycleLength] = useState(String(userData?.cycleLength || 28));
  const [isRegular, setIsRegular] = useState(Boolean(userData?.isRegular ?? true));
  const [hasConcerns, setHasConcerns] = useState(Boolean(userData?.hasConcerns ?? false));
  const [exportRows, setExportRows] = useState<Array<{ section: string; date: string; details: string }>>([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [showTableView, setShowTableView] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    if (!userData) return;
    setName(userData.name || "");
    setAge(String(userData.age || 24));
    setWeight(String(userData.weight || 60));
    setHeight(String(userData.height || 160));
    setLastPeriod(userData.lastPeriod || "");
    setCycleLength(String(userData.cycleLength || 28));
    setIsRegular(Boolean(userData.isRegular));
    setHasConcerns(Boolean(userData.hasConcerns));
  }, [userData]);

  async function handleSaveProfile() {
    if (!userData) return;
    const nextProfile: UserData = {
      ...userData,
      name: name.trim() || userData.name,
      age: Number(age) || userData.age,
      weight: Number(weight) || userData.weight,
      height: Number(height) || userData.height,
      lastPeriod: lastPeriod || userData.lastPeriod,
      cycleLength: Number(cycleLength) || userData.cycleLength,
      isRegular,
      hasConcerns,
    };
    await saveUserProfile(nextProfile);
    onProfileSaved(nextProfile);
    setIsEditing(false);
    setExportStatus("Profile updated");
  }

  async function loadExportRows() {
    setExportLoading(true);
    try {
      const [profile, logs, posts] = await Promise.all([
        getUserProfile(),
        getAllLogEntries(),
        getAllCommunityPosts(),
      ]);
      const predictions = (await getAllPredictions()) as any[];

      const rows: Array<{ section: string; date: string; details: string }> = [];

      if (profile) {
        rows.push({
          section: "Profile",
          date: profile.updatedAt || profile.lastPeriod || "",
          details: `Name: ${profile.name}; Age: ${profile.age}; Weight: ${profile.weight}; Height: ${profile.height}; Cycle: ${profile.cycleLength}; Regular: ${profile.isRegular}; Concerns: ${profile.hasConcerns}`,
        });
      }

      logs.forEach((entry) => {
        rows.push({
          section: entry.entryType === "body-map" ? "Body Map" : "Daily Log",
          date: entry.createdAt,
          details: `Pain: ${entry.painLevel}; Flow: ${entry.flow || ""}; Mood: ${entry.mood || ""}; Symptoms: ${entry.symptoms}; Notes: ${entry.notes}; Tags: ${entry.tags.join(", ")}`,
        });
      });

      predictions.forEach((prediction) => {
        rows.push({
          section: "Prediction",
          date: prediction.at || "",
          details: `Prediction: ${String(prediction.prediction)}; Input: ${JSON.stringify(prediction.input)}`,
        });
      });

      posts.forEach((post) => {
        rows.push({
          section: post.isMine ? "My Talk" : "Community Talk",
          date: post.createdAt,
          details: `User: ${post.user}; Text: ${post.text}`,
        });
      });

      setExportRows(rows);
      setExportStatus(`Loaded ${rows.length} records`);
    } catch {
      setExportStatus("Failed to load export data");
    } finally {
      setExportLoading(false);
    }
  }

  function downloadCsv() {
    if (exportRows.length === 0) return;
    const csv = [
      ["Section", "Date", "Details"],
      ...exportRows.map((row) => [row.section, row.date, row.details]),
    ]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oopsie-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadPdf() {
    if (exportRows.length === 0) return;
    const win = window.open("", "_blank", "width=1200,height=800");
    if (!win) return;
    const rowsHtml = exportRows
      .map(
        (row) => `<tr><td>${row.section}</td><td>${row.date}</td><td>${row.details}</td></tr>`
      )
      .join("");
    win.document.write(`
      <html>
        <head>
          <title>Oopsie Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
            th { background: #f4f4f4; }
          </style>
        </head>
        <body>
          <h1>Oopsie Export</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead><tr><th>Section</th><th>Date</th><th>Details</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
          <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
        </body>
      </html>
    `);
    win.document.close();
  }

  function handlePasswordSubmit() {
    // Simple password check - in production, this would be more secure
    if (passwordInput === userData?.name?.toLowerCase().replace(/\\s+/g, '') || passwordInput === '1234') {
      setIsPasswordValid(true);
      setShowPasswordModal(false);
      setShowTableView(true);
    } else {
      setExportStatus("Incorrect password");
      setPasswordInput("");
    }
  }

  async function handleLogout() {
    await deleteUserProfile();
    onLogout();
  }

  return (
    <div className={`flex flex-col gap-5 p-5 pb-28 ${theme === "dark" ? "text-slate-100" : ""}`}>
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-warm-gray">
          Profile
        </p>
        <h2 className="mt-1 font-heading text-2xl text-deep-forest">
          {userData?.name || "Priya Sharma"}
        </h2>
      </div>

      <Card className={`p-4 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white"}`}>
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

      <Card className={`p-4 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white"}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-warm-gray">
              Wellness setup
            </p>
            <h3 className="mt-1 font-heading text-lg text-deep-forest">Editable profile</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsEditing((current) => !current)}
            className="text-xs font-medium text-primary-forest hover:underline"
          >
            {isEditing ? "Close" : "Edit"}
          </button>
        </div>

        {isEditing ? (
          <div className="mt-4 grid gap-3">
            <input className="rounded-2xl border border-sand px-4 py-3" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
            <div className="grid grid-cols-3 gap-3">
              <input className="rounded-2xl border border-sand px-4 py-3" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
              <input className="rounded-2xl border border-sand px-4 py-3" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" />
              <input className="rounded-2xl border border-sand px-4 py-3" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height" />
            </div>
            <input className="rounded-2xl border border-sand px-4 py-3" type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
            <input className="rounded-2xl border border-sand px-4 py-3" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} placeholder="Cycle length" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsRegular(true)} className={`flex-1 rounded-full px-3 py-2 text-xs ${isRegular ? "bg-primary-forest text-warm-beige" : "bg-sand"}`}>Regular</button>
              <button type="button" onClick={() => setIsRegular(false)} className={`flex-1 rounded-full px-3 py-2 text-xs ${!isRegular ? "bg-primary-forest text-warm-beige" : "bg-sand"}`}>Irregular</button>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setHasConcerns(false)} className={`flex-1 rounded-full px-3 py-2 text-xs ${!hasConcerns ? "bg-sage text-warm-beige" : "bg-sand"}`}>No concerns</button>
              <button type="button" onClick={() => setHasConcerns(true)} className={`flex-1 rounded-full px-3 py-2 text-xs ${hasConcerns ? "bg-sage text-warm-beige" : "bg-sand"}`}>Has concerns</button>
            </div>
            <button type="button" onClick={handleSaveProfile} className="rounded-full bg-primary-forest px-4 py-3 text-sm text-warm-beige">Save wellness setup</button>
          </div>
        ) : null}
      </Card>

      <Card className={`p-4 text-center ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white"}`}>
        <Bell className="mx-auto text-primary-forest" />
        <p className="mt-2 text-sm font-bold text-deep-forest">Reminders</p>
      </Card>

      <Card className={`p-4 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white"}`}>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-2xl bg-warm-beige p-4">
            <span className="text-sm font-medium text-deep-forest">Dark mode</span>
            <button
              type="button"
              onClick={() => onThemeChange(theme === "dark" ? "light" : "dark")}
              className="rounded-full bg-primary-forest px-3 py-2 text-xs text-warm-beige"
            >
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </div>
          <button type="button" onClick={loadExportRows} className="flex w-full items-center justify-between rounded-2xl bg-warm-beige p-4 text-left">
            <span className="text-sm font-medium text-deep-forest">Load export data</span>
            <Settings size={16} className="text-warm-gray" />
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={downloadCsv} className="flex items-center justify-center gap-2 rounded-2xl bg-primary-forest px-4 py-3 text-xs font-medium text-warm-beige">
              <Download size={14} />
              CSV
            </button>
            <button type="button" onClick={() => { loadExportRows(); setShowPasswordModal(true); }} className="flex items-center justify-center gap-2 rounded-2xl bg-primary-forest px-4 py-3 text-xs font-medium text-warm-beige">
              <Lock size={14} />
              View my activity
            </button>
          </div>
        </div>
        {exportStatus ? <p className="mt-3 text-xs text-warm-gray">{exportStatus}</p> : null}
        {showPasswordModal ? (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`rounded-3xl p-6 max-w-sm w-full mx-4 ${theme === "dark" ? "bg-slate-900 text-slate-100" : "bg-white"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-deep-forest">Unlock your activity</h3>
                <button type="button" onClick={() => { setShowPasswordModal(false); setPasswordInput(""); }} className="text-warm-gray hover:text-deep-forest">
                  <X size={20} />
                </button>
              </div>
              <p className="text-xs text-warm-gray mb-4">Enter your password to view your activity</p>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handlePasswordSubmit()}
                placeholder="Password"
                className="w-full rounded-2xl border border-sand px-4 py-3 mb-4 text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowPasswordModal(false); setPasswordInput(""); }}
                  className="flex-1 rounded-full bg-sand px-4 py-3 text-sm font-medium text-deep-forest"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
                  className="flex-1 rounded-full bg-primary-forest px-4 py-3 text-sm font-medium text-warm-beige"
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        ) : null}
        {isPasswordValid && exportRows.length > 0 ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-sand">
            <div className="max-h-72 overflow-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-warm-beige">
                  <tr>
                    <th className="px-3 py-2">Section</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {exportRows.map((row, index) => (
                    <tr key={`${row.section}-${row.date}-${index}`} className="border-t border-sand">
                      <td className="px-3 py-2 align-top">{row.section}</td>
                      <td className="px-3 py-2 align-top whitespace-nowrap">{row.date || "-"}</td>
                      <td className="px-3 py-2 align-top">{row.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </Card>

      <Button variant="outline" className="border-rose text-rose" onClick={handleLogout}>
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [latestDailyLog, setLatestDailyLog] = useState<LogEntry | null>(null);
  const [logRefreshKey, setLogRefreshKey] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  async function refreshLatestDailyLog() {
    try {
      const entries = await getAllLogEntries();
      const latest = entries
        .filter((entry) => entry.entryType === 'daily')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null;
      setLatestDailyLog(latest);
    } catch {
      setLatestDailyLog(null);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const profile = await getUserProfile();
        setUserData(profile);
      } catch {
        setUserData(null);
      }
    })();
  }, []);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("app-theme") as "light" | "dark" | null;
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("app-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    void refreshLatestDailyLog();
  }, [activeTab, logRefreshKey]);

  return (
    <PhoneFrame>
      <div className={`flex h-full min-h-0 flex-col ${theme === "dark" ? "bg-slate-950 text-slate-100" : "bg-warm-beige"}`}>
        <div className="min-h-0 flex-1 overflow-y-auto">
          {activeTab === "home" && <HomeScreen userData={userData} latestDailyLog={latestDailyLog} theme={theme} />}
          {activeTab === "log" && (
            <LogScreen
              onSaved={async () => {
                setLogRefreshKey((current) => current + 1);
                await refreshLatestDailyLog();
              }}
            />
          )}
          {activeTab === "bodymap" && <BodyMapScreen />}
          {activeTab === "community" && <CommunityScreen />}
          {activeTab === "insights" && <InsightsScreen userData={userData} />}
          {activeTab === "profile" && (
            <ProfileScreen
              userData={userData}
              theme={theme}
              onThemeChange={setTheme}
              onProfileSaved={(profile) => {
                setUserData(profile);
                setActiveTab("home");
              }}
              onLogout={async () => {
                setUserData(null);
                setActiveTab("home");
                router.push("/");
              }}
            />
          )}
        </div>

        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </PhoneFrame>
  );
}
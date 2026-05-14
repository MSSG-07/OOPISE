"use client";
import Image from "next/image";
import { useMemo, useState, useEffect, type ReactNode } from "react";
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
import {
  addPrediction,
  getAllPredictions,
  getAllLogEntries,
  getModel,
  getUserProfile,
  saveLogEntry,
  saveBodyMapEntry,
  type LogEntry,
  type BodyMapEntry,
  type StoredProfile,
} from "@/utils/indexeddb";

type UserData = StoredProfile;

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
  const [painLevel, setPainLevel] = useState(4);
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
      createdAt: new Date().toISOString(),
      painLevel,
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
      setSelectedTags([]);
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
  const [userData, setUserData] = useState<UserData | null>(null);

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
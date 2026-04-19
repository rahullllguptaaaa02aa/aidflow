import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const categoryEmoji: Record<string, string> = {
  food: "🍱", medicine: "💊", hygiene: "🧴",
  sanitary: "🩸", shelter: "🏠", water: "💧",
  clothing: "👕", emergency: "🆘"
};

export default function Volunteers() {
  const [needs, setNeeds] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "needs"), (snap) => {
      setNeeds(snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((n: any) => n.status === "pending")
        .sort((a: any, b: any) => b.urgency - a.urgency)
      );
    });
    return () => unsub();
  }, []);

  const acceptTask = async (id: string) => {
    await updateDoc(doc(db, "needs", id), { status: "matched" });
    alert("Task accepted! Check dashboard for update.");
  };

  const matchScore = (urgency: number) => Math.min(99, 70 + urgency * 3);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Volunteer Feed</h1>
      <p className="text-gray-500 mb-6">AI-matched tasks based on your location & skills</p>

      <div className="grid grid-cols-2 gap-4">
        {needs.map((need) => (
          <div key={need.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative">
            
            {/* Match Score */}
            <div className="absolute top-4 right-4 bg-green-50 text-green-700 text-sm font-bold px-3 py-1 rounded-full border border-green-200">
              {matchScore(need.urgency)}% Match
            </div>

            {/* Category Icon + Title */}
            <div className="flex items-start gap-3 mb-3">
              <div className="text-3xl bg-gray-50 p-2 rounded-lg">
                {categoryEmoji[need.category]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 pr-20">{need.title}</h3>
                <div className="flex gap-2 mt-1 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    need.urgency >= 8 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    Urgency {need.urgency}/10
                  </span>
                  {need.decayHours <= 2 && need.decayHours > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 animate-pulse">
                      ⚠️ {need.decayHours}hr left!
                    </span>
                  )}
                  {need.isAnonymous && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                      🔒 Anonymous
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-1 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>📍</span>
                <span><strong>Pickup:</strong> {need.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎯</span>
                <span><strong>Drop-off:</strong> Nearest shelter, {need.location}</span>
              </div>
            </div>

            {/* Accept Button */}
            <button
              onClick={() => acceptTask(need.id)}
              className="w-full bg-[#1D9E75] text-white py-2.5 rounded-lg font-medium hover:bg-[#178a63] transition-colors"
            >
              Accept Task
            </button>
          </div>
        ))}

        {needs.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">✅</div>
            <p>All tasks completed! Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
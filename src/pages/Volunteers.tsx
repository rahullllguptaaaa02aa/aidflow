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
  const [resources, setResources] = useState<any[]>([]);
  const [tab, setTab] = useState<"needs"|"resources">("needs");

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "needs"), (snap) => {
      setNeeds(snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((n: any) => n.status === "pending")
        .sort((a: any, b: any) => b.urgency - a.urgency)
      );
    });
    const unsub2 = onSnapshot(collection(db, "resources"), (snap) => {
      setResources(snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((r: any) => r.status === "available")
        .sort((a: any, b: any) => a.decayHours - b.decayHours)
      );
    });
    return () => { unsub1(); unsub2(); };
  }, []);

  const acceptNeed = async (id: string) => {
    await updateDoc(doc(db, "needs", id), { status: "matched" });
    alert("✅ Task accepted! Dashboard updated.");
  };

  const acceptResource = async (id: string) => {
    await updateDoc(doc(db, "resources", id), { status: "dispatched" });
    alert("✅ Pickup confirmed! Go collect this resource.");
  };

  const matchScore = (urgency: number) => Math.min(99, 70 + urgency * 3);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Volunteer Feed</h1>
      <p className="text-gray-500 mb-4">AI-matched tasks based on your location & skills</p>

      {/* Tab Switch */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("needs")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            tab === "needs"
              ? "bg-[#1D9E75] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          🆘 Community Needs ({needs.length})
        </button>
        <button
          onClick={() => setTab("resources")}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            tab === "resources"
              ? "bg-[#1D9E75] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          📦 Available Resources ({resources.length})
        </button>
      </div>

      {/* Needs Tab */}
      {tab === "needs" && (
        <div className="grid grid-cols-2 gap-4">
          {needs.map((need) => (
            <div key={need.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 relative">
              <div className="absolute top-4 right-4 bg-green-50 text-green-700 text-sm font-bold px-3 py-1 rounded-full border border-green-200">
                {matchScore(need.urgency)}% Match
              </div>
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
              <div className="space-y-1 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span><strong>Deliver to:</strong> {need.location}</span>
                </div>
                {need.landmark && (
                  <div className="flex items-center gap-2">
                    <span>🏛️</span>
                    <span><strong>Landmark:</strong> {need.landmark}</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => acceptNeed(need.id)}
                className="w-full bg-[#1D9E75] text-white py-2.5 rounded-lg font-medium hover:bg-[#178a63] transition-colors"
              >
                Accept Task
              </button>
            </div>
          ))}
          {needs.length === 0 && (
            <div className="col-span-2 text-center py-16 text-gray-400">
              <div className="text-4xl mb-2">✅</div>
              <p>All needs matched! Check back soon.</p>
            </div>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {tab === "resources" && (
        <div className="grid grid-cols-2 gap-4">
          {resources.map((res) => (
            <div key={res.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3 mb-3">
                <div className="text-3xl bg-gray-50 p-2 rounded-lg">
                  {categoryEmoji[res.type]}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{res.item}</h3>
                  <p className="text-sm text-gray-500">By {res.donor} · Qty: {res.quantity}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      res.decayHours <= 2 ? "bg-red-100 text-red-700" :
                      res.decayHours <= 6 ? "bg-orange-100 text-orange-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      ⏱️ {res.decayHours}hr left
                      {res.decayHours <= 2 && " — CRITICAL!"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span><strong>Pickup from:</strong> {res.donor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span><strong>Deliver to:</strong> Nearest shelter in {res.type === "food" ? "Behala" : "Howrah"}</span>
                </div>
              </div>
              <button
                onClick={() => acceptResource(res.id)}
                className="w-full bg-[#1D9E75] text-white py-2.5 rounded-lg font-medium hover:bg-[#178a63] transition-colors"
              >
                🚴 Pick Up Resource
              </button>
            </div>
          ))}
          {resources.length === 0 && (
            <div className="col-span-2 text-center py-16 text-gray-400">
              <div className="text-4xl mb-2">📦</div>
              <p>No resources available right now.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
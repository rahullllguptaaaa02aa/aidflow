import { useEffect, useState } from "react";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import HeatMap from "../components/Heatmap";

const categoryEmoji: Record<string, string> = {
  food: "🍱", medicine: "💊", hygiene: "🧴",
  sanitary: "🩸", shelter: "🏠", water: "💧",
  clothing: "👕", emergency: "🆘"
};

const urgencyColor = (u: number) => {
  if (u >= 8) return "bg-red-100 text-red-700";
  if (u >= 5) return "bg-orange-100 text-orange-700";
  return "bg-green-100 text-green-700";
};

const statusColor = (s: string) => {
  if (s === "delivered") return "bg-green-100 text-green-700";
  if (s === "matched") return "bg-blue-100 text-blue-700";
  return "bg-orange-100 text-orange-700";
};

export default function Dashboard() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "needs"), (snap) => {
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((n: any) => n.title && !n.title.includes("/"));
      setNeeds(data);
    });
    return () => unsub();
  }, []);

  const filtered = filter === "all"
    ? needs
    : needs.filter((n: any) => n.category === filter);

  const categories = [
    "all", "food", "medicine", "hygiene",
    "sanitary", "shelter", "water", "clothing", "emergency"
  ];

  const markDelivered = async (id: string) => {
    await updateDoc(doc(db, "needs", id), { status: "delivered" });
  };

  const markMatched = async (id: string) => {
    await updateDoc(doc(db, "needs", id), { status: "matched" });
  };

  const total = needs.length;
  const pending = needs.filter((n: any) => n.status === "pending").length;
  const matched = needs.filter((n: any) => n.status === "matched").length;
  const delivered = needs.filter((n: any) => n.status === "delivered").length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">NGO Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Real-time overview of community needs across Kolkata
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Needs", value: total, icon: "📦", color: "text-[#1D9E75]" },
          { label: "Pending", value: pending, icon: "⏳", color: "text-orange-500" },
          { label: "Matched", value: matched, icon: "🤝", color: "text-blue-500" },
          { label: "Delivered", value: delivered, icon: "✅", color: "text-green-600" },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className={`text-3xl font-bold ${card.color}`}>
              {card.value}
            </div>
            <div className="text-gray-500 text-sm mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Live Heatmap */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            🗺️ Live Community Needs Map — Kolkata
          </h2>
          <span className="text-xs text-gray-400">
            Click any circle to see details
          </span>
        </div>
        <HeatMap />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filter === cat
                ? "bg-[#1D9E75] text-white border-[#1D9E75]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#1D9E75]"
            }`}
          >
            {cat === "all"
              ? "All"
              : `${categoryEmoji[cat]} ${cat.charAt(0).toUpperCase() + cat.slice(1)}`
            }
          </button>
        ))}
      </div>

      {/* Needs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Title", "Category", "Urgency", "Location", "Status", "Decay", "Actions"].map(h => (
                <th
                  key={h}
                  className="text-left px-4 py-3 text-sm font-medium text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  No needs found
                </td>
              </tr>
            ) : filtered.map((need: any) => (
              <tr
                key={need.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-800">
                  {need.isAnonymous && (
                    <span className="text-purple-500 mr-1">🔒</span>
                  )}
                  {need.title}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {categoryEmoji[need.category]} {need.category}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${urgencyColor(need.urgency)}`}>
                    {need.urgency}/10
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-sm">
                  {need.location}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(need.status)}`}>
                    {need.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {need.decayHours > 0 ? (
                    <span className={
                      need.decayHours <= 2
                        ? "text-red-500 font-bold animate-pulse"
                        : need.decayHours <= 6
                        ? "text-orange-500 font-medium"
                        : "text-gray-400"
                    }>
                      {need.decayHours}hr left
                    </span>
                  ) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {need.status === "pending" && (
                      <button
                        onClick={() => markMatched(need.id)}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Match
                      </button>
                    )}
                    {need.status === "matched" && (
                      <button
                        onClick={() => markDelivered(need.id)}
                        className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        ✅ Delivered
                      </button>
                    )}
                    {need.status === "delivered" && (
                      <span className="text-xs text-green-500 font-medium">
                        Done ✓
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
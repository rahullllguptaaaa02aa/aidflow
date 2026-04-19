import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

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
      setNeeds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const filtered = filter === "all" ? needs : needs.filter(n => n.category === filter);
  const categories = ["all","food","medicine","hygiene","sanitary","shelter","water","clothing","emergency"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">NGO Dashboard</h1>
      <p className="text-gray-500 mb-6">Real-time overview of community needs across Kolkata</p>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Needs", value: needs.length, icon: "📦" },
          { label: "Pending", value: needs.filter(n=>n.status==="pending").length, icon: "⏳" },
          { label: "Matched", value: needs.filter(n=>n.status==="matched").length, icon: "🤝" },
          { label: "Delivered", value: needs.filter(n=>n.status==="delivered").length, icon: "✅" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">{card.icon}</div>
            <div className="text-3xl font-bold text-[#1D9E75]">{card.value}</div>
            <div className="text-gray-500 text-sm mt-1">{card.label}</div>
          </div>
        ))}
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
            {cat === "all" ? "All" : `${categoryEmoji[cat]} ${cat.charAt(0).toUpperCase()+cat.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Needs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Title","Category","Urgency","Location","Status","Decay"].map(h => (
                <th key={h} className="text-left px-4 py-3 text-sm font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No needs found</td></tr>
            ) : filtered.map((need) => (
              <tr key={need.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {need.isAnonymous && <span className="text-purple-500 mr-1">🔒</span>}
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
                <td className="px-4 py-3 text-gray-600">{need.location}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(need.status)}`}>
                    {need.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 font-mono text-sm">
                  {need.decayHours ? (
                    <span className={need.decayHours <= 2 ? "text-red-500 font-bold" : "text-gray-500"}>
                      {need.decayHours}hr left
                    </span>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
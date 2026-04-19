import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { model } from "../gemini";

export default function DonorImpact() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [aiStory, setAiStory] = useState("");
  const [loadingStory, setLoadingStory] = useState(false);

  useEffect(() => {
    onSnapshot(collection(db, "needs"), (snap) => {
      setNeeds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    onSnapshot(collection(db, "resources"), (snap) => {
      setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  const delivered = needs.filter(n => n.status === "delivered");
  const matched = needs.filter(n => n.status === "matched");
  const foodNeeds = needs.filter(n => n.category === "food").length;
  const sanitaryNeeds = needs.filter(n => n.category === "sanitary").length;

  const generateStory = async () => {
    setLoadingStory(true);
    try {
      const prompt = `You are writing a donor impact report for AidFlow, a community resource platform in Kolkata.
      
Current stats:
- Total needs logged: ${needs.length}
- Delivered successfully: ${delivered.length}
- Currently matched: ${matched.length}
- Food needs: ${foodNeeds}
- Sanitary/hygiene needs: ${sanitaryNeeds}
- Resources available: ${resources.length}

Write a warm, emotional 3-sentence impact story for donors. Mention specific Kolkata locations like Behala, Howrah, Salt Lake. Include the dignity aspect of anonymous sanitary requests. Make it feel real and human. No bullet points, just a flowing paragraph.`;

      const result = await model.generateContent(prompt);
      setAiStory(result.response.text());
    } catch (e) {
      setAiStory("Your generosity is transforming lives across Kolkata — from hot meals in Behala to dignity kits for girls in Howrah. Every donation creates a ripple of hope in our community.");
    }
    setLoadingStory(false);
  };

  const topDonors = [
    { name: "Annapurna Hotel", amount: "₹5,000", impact: 245, category: "🍱" },
    { name: "Apollo Pharmacy", amount: "₹3,200", impact: 189, category: "💊" },
    { name: "Rahul Sharma", amount: "₹2,500", impact: 156, category: "🩸" },
    { name: "City Supermart", amount: "₹1,800", impact: 98, category: "🧴" },
    { name: "Anonymous", amount: "₹1,200", impact: 67, category: "❤️" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Donor Impact Dashboard</h1>
      <p className="text-gray-500 mb-6">See the real difference your contributions make</p>

      {/* Impact Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Needs Logged", value: needs.length, icon: "📦", color: "text-[#1D9E75]" },
          { label: "Successfully Delivered", value: delivered.length, icon: "✅", color: "text-green-600" },
          { label: "Resources Available", value: resources.length, icon: "🤝", color: "text-blue-600" },
          { label: "Dignity Requests", value: sanitaryNeeds, icon: "🩸", color: "text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* AI Impact Story */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-[#1D9E75] mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            ✨ AI Generated Impact Story
          </h2>
          <button
            onClick={generateStory}
            disabled={loadingStory}
            className="bg-[#1D9E75] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#178a63] transition-colors disabled:opacity-50"
          >
            {loadingStory ? "Generating..." : "Generate Story"}
          </button>
        </div>

        {aiStory ? (
          <p className="text-gray-700 leading-relaxed italic">"{aiStory}"</p>
        ) : (
          <p className="text-gray-400 text-sm">
            Click "Generate Story" to create a personalized AI impact narrative using real data from Firebase.
          </p>
        )}
      </div>

      {/* Top Donors Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold">🏆 Top Donors Leaderboard</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {["Rank", "Donor", "Category", "Amount", "Impact Score"].map(h => (
                <th key={h} className="text-left px-6 py-3 text-sm font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {topDonors.map((donor, i) => (
              <tr key={donor.name} className="border-t border-gray-50 hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-400">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">{donor.name}</td>
                <td className="px-6 py-4 text-xl">{donor.category}</td>
                <td className="px-6 py-4 text-[#1D9E75] font-bold">{donor.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-[#1D9E75] h-2 rounded-full"
                        style={{width: `${(donor.impact/245)*100}%`}}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{donor.impact}</span>
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
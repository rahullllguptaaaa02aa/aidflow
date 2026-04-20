import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { model } from "../gemini";

export default function DonorImpact() {
  const [needs, setNeeds] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [aiStory, setAiStory] = useState("");
  const [loadingStory, setLoadingStory] = useState(false);
  const [donorForm, setDonorForm] = useState({
    name: "", amount: "", category: "food"
  });
  const [donated, setDonated] = useState(false);

  useEffect(() => {
    onSnapshot(collection(db, "needs"), (snap) => {
      setNeeds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    onSnapshot(collection(db, "resources"), (snap) => {
      setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    onSnapshot(collection(db, "donors"), (snap) => {
      setDonors(snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a: any, b: any) => b.amount - a.amount)
      );
    });
  }, []);

  const delivered = needs.filter((n: any) => n.status === "delivered").length;
  const dignityRequests = needs.filter((n: any) => n.isAnonymous === true).length;
  const foodDelivered = needs.filter((n: any) => n.category === "food" && n.status === "delivered").length;
  const sanitaryDelivered = needs.filter((n: any) => n.category === "sanitary" && n.status === "delivered").length;

  const generateStory = async () => {
    setLoadingStory(true);
    try {
      const prompt = `You are writing a warm donor impact report for AidFlow, a community resource platform in Kolkata, India.

Real data from today:
- Total needs logged: ${needs.length}
- Successfully delivered: ${delivered}
- Food deliveries: ${foodDelivered}
- Anonymous dignity requests fulfilled: ${dignityRequests}
- Resources available: ${resources.length}
- Active donors: ${donors.length}

Write a heartfelt, emotional 3-sentence impact story for donors. 
Mention specific Kolkata locations like Behala, Howrah, Salt Lake, Park Circus.
Include the dignity aspect — women requesting sanitary products anonymously with just a pincode.
Make it feel real, human and inspiring. 
No bullet points, just a beautiful flowing paragraph.
Start with "Today," or "This week," to make it feel immediate.`;

      const result = await model.generateContent(prompt);
      setAiStory(result.response.text());
    } catch (e) {
      setAiStory(`Today, AidFlow connected ${delivered} families across Behala and Howrah with essential resources — from hot meals to sanitary kits delivered with complete anonymity and dignity. Your contributions didn't just fill stomachs; they restored hope in communities where need often goes unseen. Together, we're proving that technology and compassion can eliminate the gap between surplus and suffering.`);
    }
    setLoadingStory(false);
  };

  const handleDonate = async () => {
    if (!donorForm.name || !donorForm.amount) {
      alert("Please fill your name and amount!");
      return;
    }
    await addDoc(collection(db, "donors"), {
      name: donorForm.name,
      amount: Number(donorForm.amount),
      category: donorForm.category,
      impactScore: Math.floor(Number(donorForm.amount) / 10),
      timestamp: new Date().toISOString()
    });
    setDonated(true);
    setDonorForm({ name: "", amount: "", category: "food" });
    setTimeout(() => setDonated(false), 3000);
  };

  const categoryEmoji: Record<string, string> = {
    food: "🍱", medicine: "💊", hygiene: "🧴",
    sanitary: "🩸", shelter: "🏠", water: "💧",
    clothing: "👕", emergency: "🆘"
  };

  const getRankIcon = (i: number) => {
    if (i === 0) return "🥇";
    if (i === 1) return "🥈";
    if (i === 2) return "🥉";
    return `#${i + 1}`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Donor Impact Dashboard</h1>
      <p className="text-gray-500 mb-6">
        See the real difference your contributions make
      </p>

      {/* Impact Stats — all from Firebase */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Needs Logged", value: needs.length, icon: "📦", color: "text-[#1D9E75]" },
          { label: "Successfully Delivered", value: delivered, icon: "✅", color: "text-green-600" },
          { label: "Resources Available", value: resources.length, icon: "🤝", color: "text-blue-600" },
          { label: "Dignity Requests", value: dignityRequests, icon: "🩸", color: "text-purple-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* AI Impact Story */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-[#1D9E75]">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              ✨ AI Generated Impact Story
            </h2>
            <button
              onClick={generateStory}
              disabled={loadingStory}
              className="bg-[#1D9E75] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#178a63] transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loadingStory ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Generating...
                </>
              ) : "Generate Story"}
            </button>
          </div>
          {aiStory ? (
            <p className="text-gray-700 leading-relaxed italic">
              "{aiStory}"
            </p>
          ) : (
            <p className="text-gray-400 text-sm">
              Click "Generate Story" to create a personalized AI impact
              narrative using real live data from Firebase.
            </p>
          )}
        </div>

        {/* Donate Money Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">💝 Make a Donation</h2>

          {donated && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm font-medium">
              ✅ Thank you! Your donation has been recorded.
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Your Name
              </label>
              <input
                value={donorForm.name}
                onChange={e => setDonorForm({...donorForm, name: e.target.value})}
                placeholder="e.g. Rahul Sharma"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D9E75]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Amount (₹)
              </label>
              <input
                value={donorForm.amount}
                onChange={e => setDonorForm({...donorForm, amount: e.target.value})}
                placeholder="e.g. 500"
                type="number"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D9E75]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Support Category
              </label>
              <select
                value={donorForm.category}
                onChange={e => setDonorForm({...donorForm, category: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D9E75]"
              >
                {Object.entries(categoryEmoji).map(([key, emoji]) => (
                  <option key={key} value={key}>
                    {emoji} {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleDonate}
              className="w-full bg-[#1D9E75] text-white py-2.5 rounded-lg font-medium hover:bg-[#178a63] transition-colors"
            >
              💝 Donate Now
            </button>
          </div>
        </div>
      </div>

      {/* Live Donor Leaderboard from Firebase */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold">🏆 Live Donor Leaderboard</h2>
          <span className="text-xs text-gray-400">
            {donors.length} donors · updates in real time
          </span>
        </div>
        {donors.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No donors yet — be the first!</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Rank","Donor","Category","Amount","Impact Score"].map(h => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-sm font-medium text-gray-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {donors.map((donor: any, i: number) => (
                <tr
                  key={donor.id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-bold text-gray-400">
                    {getRankIcon(i)}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {donor.name}
                  </td>
                  <td className="px-6 py-4 text-xl">
                    {categoryEmoji[donor.category] || "❤️"}
                  </td>
                  <td className="px-6 py-4 text-[#1D9E75] font-bold">
                    ₹{donor.amount?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-[#1D9E75] h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (donor.impactScore / (donors[0]?.impactScore || 1)) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {donor.impactScore}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
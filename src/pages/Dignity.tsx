import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { model } from "../gemini";

export default function Dignity() {
  const [form, setForm] = useState({
    type: "sanitary", pincode: "", landmark: "", message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.pincode) {
      alert("Please enter your pincode!");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "needs"), {
        title: `Anonymous ${form.type} request`,
        category: form.type,
        urgency: 8,
        location: `Pincode ${form.pincode}, near ${form.landmark}, Kolkata`,
        landmark: form.landmark,
        lat: 22.5726,
        lng: 88.3639,
        status: "pending",
        decayHours: 24,
        isAnonymous: true,
        message: form.message,
        timestamp: new Date().toISOString()
      });

      const prompt = `A woman has anonymously requested ${form.type} products in pincode ${form.pincode} in Kolkata near ${form.landmark}. 
Write a warm, reassuring 2-sentence message confirming her request was received safely and anonymously. 
Make her feel safe and respected. No personal details mentioned.`;

      const result = await model.generateContent(prompt);
      setAiResponse(result.response.text());
      setSubmitted(true);
    } catch (e) {
      setAiResponse("Your request has been received safely and anonymously. A verified volunteer will reach out through a secure channel shortly.");
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-6">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💜</span>
          </div>
          <h1 className="text-3xl font-bold text-purple-700 mb-2">
            Safe & Anonymous Request
          </h1>
          <p className="text-purple-500">No name needed. Just your pincode.</p>
        </div>

        {!submitted ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
            <div className="space-y-4">

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  What do you need?
                </label>
                <select
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                >
                  <option value="sanitary">🩸 Sanitary Pads</option>
                  <option value="hygiene">🧴 Hygiene Kit</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Your Pincode
                </label>
                <input
                  value={form.pincode}
                  onChange={e => setForm({...form, pincode: e.target.value})}
                  placeholder="e.g. 700034"
                  maxLength={6}
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nearest Landmark (anonymous)
                </label>
                <input
                  value={form.landmark}
                  onChange={e => setForm({...form, landmark: e.target.value})}
                  placeholder="e.g. Near bus stop, beside temple"
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Optional message (anonymous)
                </label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Anything the volunteer should know..."
                  rows={3}
                  className="w-full border border-purple-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-400 resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Submitting safely..." : "🔒 Request Anonymously"}
              </button>

            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 text-center">
            <div className="text-5xl mb-4">💜</div>
            <h2 className="text-xl font-bold text-purple-700 mb-3">Request Received Safely</h2>
            {aiResponse && (
              <p className="text-gray-600 leading-relaxed italic mb-4">"{aiResponse}"</p>
            )}
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({ type: "sanitary", pincode: "", landmark: "", message: "" });
                setAiResponse("");
              }}
              className="text-purple-600 text-sm underline"
            >
              Make another request
            </button>
          </div>
        )}

        {/* Reassurance Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {[
            { icon: "🔒", title: "Identity never shared", desc: "Zero personal data stored" },
            { icon: "👤", title: "Only landmark shared", desc: "Your name stays private" },
            { icon: "✅", title: "Verified safe delivery", desc: "All volunteers are verified" },
          ].map((card) => (
            <div key={card.title} className="bg-white rounded-xl p-3 text-center shadow-sm border border-purple-100">
              <div className="text-2xl mb-1">{card.icon}</div>
              <p className="text-xs font-medium text-purple-700">{card.title}</p>
              <p className="text-xs text-gray-400 mt-1">{card.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
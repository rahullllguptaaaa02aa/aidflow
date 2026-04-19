import { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const categoryEmoji: Record<string, string> = {
  food: "🍱", medicine: "💊", hygiene: "🧴",
  sanitary: "🩸", shelter: "🏠", water: "💧",
  clothing: "👕", emergency: "🆘"
};

export default function Resources() {
  const [resources, setResources] = useState<any[]>([]);
  const [form, setForm] = useState({
    type: "food", item: "", quantity: "", donor: "", decayHours: 4
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "resources"), (snap) => {
      setResources(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleSubmit = async () => {
    if (!form.item || !form.quantity || !form.donor) {
      alert("Please fill all fields!");
      return;
    }
    await addDoc(collection(db, "resources"), {
      ...form,
      quantity: Number(form.quantity),
      status: "available",
      lat: 22.5726,
      lng: 88.3639,
      timestamp: new Date().toISOString()
    });
    setSubmitted(true);
    setForm({ type: "food", item: "", quantity: "", donor: "", decayHours: 4 });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-1">Resource Donor Portal</h1>
      <p className="text-gray-500 mb-6">Log surplus resources for your community</p>

      <div className="grid grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Donate a Resource</h2>

          {submitted && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm font-medium">
              ✅ Resource donated successfully! AI matching in progress...
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
              <select
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D9E75]"
              >
                {Object.entries(categoryEmoji).map(([key, emoji]) => (
                  <option key={key} value={key}>{emoji} {key.charAt(0).toUpperCase()+key.slice(1)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Item Name</label>
              <input
                value={form.item}
                onChange={e => setForm({...form, item: e.target.value})}
                placeholder="e.g. Cooked rice meals, Paracetamol 500mg"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D9E75]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Quantity</label>
              <input
                value={form.quantity}
                onChange={e => setForm({...form, quantity: e.target.value})}
                placeholder="e.g. 50 meals, 100 tablets"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D9E75]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Your Name / Organisation</label>
              <input
                value={form.donor}
                onChange={e => setForm({...form, donor: e.target.value})}
                placeholder="e.g. Hotel Annapurna, Apollo Pharmacy"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1D9E75]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Expires in: <span className="text-[#1D9E75] font-bold">{form.decayHours} hours</span>
              </label>
              <input
                type="range" min="1" max="72"
                value={form.decayHours}
                onChange={e => setForm({...form, decayHours: Number(e.target.value)})}
                className="w-full accent-[#1D9E75]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1hr (Very urgent)</span>
                <span>72hrs (3 days)</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#1D9E75] text-white py-3 rounded-lg font-medium hover:bg-[#178a63] transition-colors"
            >
              🤝 Donate Resource
            </button>
          </div>
        </div>

        {/* Live Resources List */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Resources ({resources.length})</h2>
          <div className="space-y-3">
            {resources.map((res) => (
              <div key={res.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{categoryEmoji[res.type]}</span>
                    <div>
                      <p className="font-medium text-gray-800">{res.item}</p>
                      <p className="text-xs text-gray-500">{res.donor} · Qty: {res.quantity}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    res.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {res.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-xs font-medium ${
                    res.decayHours <= 2 ? "text-red-500" : 
                    res.decayHours <= 6 ? "text-orange-500" : "text-gray-400"
                  }`}>
                    ⏱️ {res.decayHours}hr left
                    {res.decayHours <= 2 && " — URGENT!"}
                  </span>
                </div>
              </div>
            ))}
            {resources.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No resources yet. Be the first to donate!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
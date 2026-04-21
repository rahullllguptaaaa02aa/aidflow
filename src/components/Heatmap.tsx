import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const urgencyColor = (urgency: number) => {
  if (urgency >= 8) return "#E24B4A";
  if (urgency >= 5) return "#F59E0B";
  return "#1D9E75";
};

const categoryEmoji: Record<string, string> = {
  food: "🍱", medicine: "💊", hygiene: "🧴",
  sanitary: "🩸", shelter: "🏠", water: "💧",
  clothing: "👕", emergency: "🆘"
};

export default function Heatmap() {
  const mapRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [needs, setNeeds] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "needs"), (snap) => {
      const data = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((n: any) => n.lat && n.lng && n.title && !n.title.includes("/"));
      setNeeds(data);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = async () => {
      const L = await import("leaflet");

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(
          [22.5726, 88.3639], 11
        );

        L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution: '&copy; OpenStreetMap contributors'
          }
        ).addTo(mapInstanceRef.current);
      }

      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      needs.forEach((need) => {
        if (!need.lat || !need.lng) return;

        const circle = L.circleMarker([need.lat, need.lng], {
          radius: Math.max(8, need.urgency * 3),
          color: urgencyColor(need.urgency),
          fillColor: urgencyColor(need.urgency),
          fillOpacity: 0.5,
          weight: 2,
        }).addTo(mapInstanceRef.current);

        circle.bindPopup(`
          <div style="min-width:180px;font-family:sans-serif">
            <div style="font-weight:600;font-size:13px;margin-bottom:6px">
              ${categoryEmoji[need.category] || "📦"} ${need.title}
            </div>
            <div style="font-size:11px;color:#666;margin-bottom:6px">
              📍 ${need.location}
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap">
              <span style="background:${urgencyColor(need.urgency)};color:white;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:600">
                Urgency ${need.urgency}/10
              </span>
              <span style="background:#f3f4f6;color:#374151;padding:2px 8px;border-radius:20px;font-size:10px;text-transform:capitalize">
                ${need.status}
              </span>
            </div>
            ${need.decayHours > 0 ? `
              <div style="margin-top:6px;font-size:11px;color:${need.decayHours <= 2 ? '#E24B4A' : '#F59E0B'};font-weight:${need.decayHours <= 2 ? 600 : 400}">
                ⏱️ ${need.decayHours}hr left${need.decayHours <= 2 ? ' — URGENT!' : ''}
              </div>
            ` : ''}
            ${need.isAnonymous ? `
              <div style="margin-top:4px;font-size:11px;color:#7C3AED">
                🔒 Anonymous dignity request
              </div>
            ` : ''}
          </div>
        `);

        circle.on("click", () => setSelected(need));
        markersRef.current.push(circle);
      });
    };

    initMap();
  }, [needs]);

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-3 flex-wrap">
        <span className="text-xs font-medium text-gray-500">Urgency:</span>
        {[
          { color: "#E24B4A", label: "Critical (8-10)" },
          { color: "#F59E0B", label: "Moderate (5-7)" },
          { color: "#1D9E75", label: "Low (1-4)" },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: item.color }}
            />
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
        <span className="text-xs text-gray-400 ml-auto">
          {needs.length} active needs
        </span>
      </div>

      {/* Map Container */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div
        ref={mapRef}
        style={{ height: "420px", width: "100%", borderRadius: "12px", zIndex: 0 }}
        className="border border-gray-100 shadow-sm overflow-hidden"
      />

      {/* Selected Need Brief */}
      {selected && (
        <div className="mt-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-gray-800 mb-1">
                {categoryEmoji[selected.category]} {selected.title}
              </div>
              <div className="text-sm text-gray-500">
                📍 {selected.location}
              </div>
              {selected.isAnonymous && (
                <div className="text-xs text-purple-600 mt-1">
                  🔒 Anonymous dignity request
                </div>
              )}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            <span
              className="text-xs px-2 py-1 rounded-full font-bold text-white"
              style={{ background: urgencyColor(selected.urgency) }}
            >
              Urgency {selected.urgency}/10
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
              {selected.status}
            </span>
            {selected.decayHours > 0 && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                selected.decayHours <= 2
                  ? "bg-red-100 text-red-600"
                  : "bg-orange-100 text-orange-600"
              }`}>
                ⏱️ {selected.decayHours}hr left
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
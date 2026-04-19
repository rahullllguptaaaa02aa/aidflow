export type Category = "food" | "medicine" | "hygiene" | "sanitary" | "shelter" | "water" | "clothing" | "emergency";

export const CATEGORY_META: Record<Category, { emoji: string; label: string }> = {
  food: { emoji: "🍱", label: "Food" },
  medicine: { emoji: "💊", label: "Medicine" },
  hygiene: { emoji: "🧴", label: "Hygiene" },
  sanitary: { emoji: "🩸", label: "Sanitary" },
  shelter: { emoji: "🏠", label: "Shelter" },
  water: { emoji: "💧", label: "Water" },
  clothing: { emoji: "👕", label: "Clothing" },
  emergency: { emoji: "🆘", label: "Emergency" },
};

export const CATEGORIES = Object.keys(CATEGORY_META) as Category[];

export type Status = "pending" | "matched" | "delivered";

export interface Need {
  id: string;
  title: string;
  category: Category;
  urgency: number; // 1-10
  location: string;
  status: Status;
  decayMinutes: number; // total minutes left when created
  createdAt: number;
}

const now = Date.now();

export const NEEDS: Need[] = [
  { id: "n1", title: "Hot meals for shelter residents", category: "food", urgency: 9, location: "Behala", status: "pending", decayMinutes: 134, createdAt: now },
  { id: "n2", title: "Insulin for diabetic patients", category: "medicine", urgency: 10, location: "Salt Lake", status: "matched", decayMinutes: 45, createdAt: now },
  { id: "n3", title: "Sanitary pads for girls school", category: "sanitary", urgency: 7, location: "Howrah", status: "pending", decayMinutes: 320, createdAt: now },
  { id: "n4", title: "Drinking water bottles", category: "water", urgency: 8, location: "Park Circus", status: "pending", decayMinutes: 90, createdAt: now },
  { id: "n5", title: "Warm blankets for night shelter", category: "shelter", urgency: 6, location: "Sealdah", status: "delivered", decayMinutes: 600, createdAt: now },
  { id: "n6", title: "Soap and shampoo kits", category: "hygiene", urgency: 4, location: "Tollygunge", status: "pending", decayMinutes: 720, createdAt: now },
  { id: "n7", title: "Children's clothing donations", category: "clothing", urgency: 3, location: "Garia", status: "matched", decayMinutes: 1440, createdAt: now },
  { id: "n8", title: "Emergency rescue supplies", category: "emergency", urgency: 10, location: "Dum Dum", status: "pending", decayMinutes: 30, createdAt: now },
];

export interface VolunteerTask {
  id: string;
  title: string;
  category: Category;
  matchScore: number;
  urgency: number;
  pickup: string;
  dropoff: string;
  decayMinutes: number;
}

export const VOLUNTEER_TASKS: VolunteerTask[] = [
  { id: "t1", title: "Deliver 20 hot meals to night shelter", category: "food", matchScore: 96, urgency: 9, pickup: "Annapurna Kitchen, Behala", dropoff: "Hope Shelter, Behala", decayMinutes: 110 },
  { id: "t2", title: "Drop insulin to diabetic camp", category: "medicine", matchScore: 92, urgency: 10, pickup: "MediCare Pharmacy, Salt Lake", dropoff: "Community Clinic, Salt Lake", decayMinutes: 45 },
  { id: "t3", title: "Sanitary kits for Howrah girls school", category: "sanitary", matchScore: 88, urgency: 7, pickup: "Care Foundation, Howrah", dropoff: "Sunrise Girls School", decayMinutes: 240 },
  { id: "t4", title: "Distribute water bottles", category: "water", matchScore: 85, urgency: 8, pickup: "Aqua Pure Depot, Park Circus", dropoff: "Slum Outreach, Park Circus", decayMinutes: 90 },
  { id: "t5", title: "Hand out hygiene kits", category: "hygiene", matchScore: 78, urgency: 5, pickup: "DonorHub Tollygunge", dropoff: "Childcare Home, Tollygunge", decayMinutes: 480 },
];

export interface DonatedResource {
  id: string;
  itemName: string;
  category: Category;
  quantity: number;
  donor: string;
  expiryHours: number;
  createdAt: number;
  status: Status;
}

export const INITIAL_DONATIONS: DonatedResource[] = [
  { id: "d1", itemName: "Cooked rice meals", category: "food", quantity: 40, donor: "Spice Garden Restaurant", expiryHours: 4, createdAt: Date.now() - 1000 * 60 * 60, status: "matched" },
  { id: "d2", itemName: "Sanitary pad packs", category: "sanitary", quantity: 25, donor: "Whisper Foundation", expiryHours: 48, createdAt: Date.now() - 1000 * 60 * 30, status: "pending" },
  { id: "d3", itemName: "Water bottles (1L)", category: "water", quantity: 100, donor: "Aqua Co.", expiryHours: 24, createdAt: Date.now() - 1000 * 60 * 90, status: "delivered" },
];

export const TOP_DONORS = [
  { name: "Spice Garden Restaurant", amount: 8200, score: 96 },
  { name: "Whisper Foundation", amount: 6500, score: 91 },
  { name: "Aqua Co.", amount: 5400, score: 88 },
  { name: "Sunrise Pharmacy", amount: 3900, score: 82 },
  { name: "Anjali Sharma", amount: 2500, score: 78 },
];

export function urgencyColor(score: number): "destructive" | "warning" | "success" {
  if (score >= 8) return "destructive";
  if (score >= 5) return "warning";
  return "success";
}

export function formatDecay(minutes: number): string {
  if (minutes <= 0) return "Expired";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return `${h}hr ${m}min`;
}

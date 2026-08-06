/**
 * Mock data layer.
 * Mirrors the FastAPI response contracts documented in `backend/API.md`
 * so swapping mock -> real API is a one-file change.
 */

export type Role = "citizen" | "volunteer" | "ngo" | "hospital" | "government" | "admin";

export const ROLES: { id: Role; label: string; blurb: string; icon: string }[] = [
  { id: "citizen", label: "Citizen", blurb: "Report, request aid, stay safe", icon: "LifeBuoy" },
  { id: "volunteer", label: "Volunteer", blurb: "Accept and run rescue missions", icon: "HeartHandshake" },
  { id: "ngo", label: "NGO", blurb: "Relief inventory & distribution", icon: "Boxes" },
  { id: "hospital", label: "Hospital", blurb: "Beds, ICU, blood, ambulances", icon: "Stethoscope" },
  { id: "government", label: "Government", blurb: "Command center & analytics", icon: "Landmark" },
  { id: "admin", label: "Administrator", blurb: "Platform-wide governance", icon: "ShieldCheck" },
];

export type Severity = "critical" | "high" | "moderate" | "low";

export interface Disaster {
  id: string;
  type: "Flood" | "Earthquake" | "Cyclone" | "Landslide" | "Fire";
  district: string;
  severity: Severity;
  affected: number;
  displaced: number;
  startedAt: string;
  aiSeverityScore: number;
  x: number;
  y: number;
}

export const disasters: Disaster[] = [
  { id: "DSR-4411", type: "Flood", district: "Kendrapara, Odisha", severity: "critical", affected: 128400, displaced: 21400, startedAt: "6h ago", aiSeverityScore: 92, x: 62, y: 44 },
  { id: "DSR-4408", type: "Cyclone", district: "Balasore Coast", severity: "high", affected: 74300, displaced: 9800, startedAt: "11h ago", aiSeverityScore: 81, x: 74, y: 30 },
  { id: "DSR-4395", type: "Landslide", district: "Wayanad, Kerala", severity: "high", affected: 8600, displaced: 2400, startedAt: "1d ago", aiSeverityScore: 77, x: 26, y: 72 },
  { id: "DSR-4380", type: "Earthquake", district: "Chamoli, Uttarakhand", severity: "moderate", affected: 15200, displaced: 3100, startedAt: "2d ago", aiSeverityScore: 58, x: 40, y: 18 },
  { id: "DSR-4362", type: "Fire", district: "Bhiwandi Industrial Belt", severity: "low", affected: 1900, displaced: 320, startedAt: "3d ago", aiSeverityScore: 34, x: 22, y: 48 },
];

export type RequestKind = "Rescue" | "Food" | "Water" | "Medicine" | "Shelter";
export type RequestStatus = "pending" | "assigned" | "en-route" | "resolved";

export interface AidRequest {
  id: string;
  kind: RequestKind;
  requester: string;
  people: number;
  location: string;
  status: RequestStatus;
  priority: Severity;
  aiPriorityScore: number;
  raisedAt: string;
  eta?: string;
  x: number;
  y: number;
}

export const aidRequests: AidRequest[] = [
  { id: "REQ-90341", kind: "Rescue", requester: "Anita Pradhan", people: 6, location: "Ward 12, Kendrapara", status: "en-route", priority: "critical", aiPriorityScore: 97, raisedAt: "12 min ago", eta: "8 min", x: 60, y: 42 },
  { id: "REQ-90338", kind: "Medicine", requester: "Suresh Nayak", people: 3, location: "Relief Camp B, Rajnagar", status: "assigned", priority: "high", aiPriorityScore: 88, raisedAt: "26 min ago", eta: "22 min", x: 64, y: 47 },
  { id: "REQ-90330", kind: "Water", requester: "Fatima Sheikh", people: 42, location: "Govt School Shelter, Pattamundai", status: "pending", priority: "high", aiPriorityScore: 84, raisedAt: "41 min ago", x: 57, y: 51 },
  { id: "REQ-90322", kind: "Shelter", requester: "Rakesh Bhoi", people: 11, location: "Marshaghai Block", status: "pending", priority: "moderate", aiPriorityScore: 66, raisedAt: "1h ago", x: 69, y: 39 },
  { id: "REQ-90311", kind: "Food", requester: "Camp Coordinator", people: 260, location: "Relief Camp A, Aul", status: "resolved", priority: "moderate", aiPriorityScore: 51, raisedAt: "3h ago", x: 52, y: 36 },
  { id: "REQ-90305", kind: "Rescue", requester: "Deepa Mohanty", people: 2, location: "Riverbank Colony", status: "resolved", priority: "critical", aiPriorityScore: 95, raisedAt: "5h ago", x: 47, y: 58 },
];

export interface Shelter {
  id: string;
  name: string;
  district: string;
  capacity: number;
  occupied: number;
  meals: "adequate" | "low" | "critical";
  x: number;
  y: number;
}

export const shelters: Shelter[] = [
  { id: "SHL-21", name: "Govt High School Camp", district: "Pattamundai", capacity: 800, occupied: 742, meals: "low", x: 56, y: 50 },
  { id: "SHL-18", name: "Community Hall Relief Camp", district: "Aul", capacity: 500, occupied: 268, meals: "adequate", x: 51, y: 37 },
  { id: "SHL-30", name: "Stadium Mega Shelter", district: "Kendrapara", capacity: 2400, occupied: 2310, meals: "critical", x: 63, y: 45 },
  { id: "SHL-07", name: "Panchayat Bhavan Camp", district: "Marshaghai", capacity: 350, occupied: 190, meals: "adequate", x: 70, y: 40 },
];

export interface Hospital {
  id: string;
  name: string;
  beds: number;
  bedsFree: number;
  icu: number;
  icuFree: number;
  ambulances: number;
  ambulancesFree: number;
  doctorsOnCall: number;
  blood: Record<"A+" | "B+" | "O+" | "AB+" | "O-", number>;
  x: number;
  y: number;
}

export const hospitals: Hospital[] = [
  { id: "HSP-01", name: "District HQ Hospital", beds: 420, bedsFree: 58, icu: 40, icuFree: 4, ambulances: 14, ambulancesFree: 3, doctorsOnCall: 22, blood: { "A+": 32, "B+": 24, "O+": 41, "AB+": 9, "O-": 6 }, x: 61, y: 43 },
  { id: "HSP-02", name: "Sub-divisional Hospital", beds: 180, bedsFree: 41, icu: 12, icuFree: 2, ambulances: 6, ambulancesFree: 2, doctorsOnCall: 9, blood: { "A+": 12, "B+": 8, "O+": 15, "AB+": 3, "O-": 1 }, x: 55, y: 48 },
  { id: "HSP-03", name: "Medical College & Trauma Center", beds: 900, bedsFree: 210, icu: 90, icuFree: 19, ambulances: 26, ambulancesFree: 11, doctorsOnCall: 54, blood: { "A+": 88, "B+": 62, "O+": 104, "AB+": 21, "O-": 17 }, x: 44, y: 55 },
];

export interface Volunteer {
  id: string;
  name: string;
  skill: string;
  missions: number;
  rating: number;
  status: "available" | "on-mission" | "resting";
  x: number;
  y: number;
}

export const volunteers: Volunteer[] = [
  { id: "VOL-118", name: "Arjun Mehta", skill: "Boat Rescue", missions: 42, rating: 4.9, status: "on-mission", x: 59, y: 41 },
  { id: "VOL-204", name: "Priya Raut", skill: "First Aid", missions: 27, rating: 4.8, status: "available", x: 65, y: 46 },
  { id: "VOL-311", name: "Imran Qureshi", skill: "Logistics", missions: 61, rating: 4.7, status: "available", x: 50, y: 52 },
  { id: "VOL-402", name: "Sneha Kulkarni", skill: "Medical Support", missions: 15, rating: 4.6, status: "resting", x: 68, y: 37 },
];

export const inventory = [
  { item: "Rice (25kg sacks)", category: "Food", stock: 1240, allocated: 860, unit: "sacks" },
  { item: "Drinking Water", category: "Water", stock: 18400, allocated: 12900, unit: "litres" },
  { item: "ORS Sachets", category: "Medicine", stock: 9600, allocated: 4100, unit: "packs" },
  { item: "Antibiotics Kit", category: "Medicine", stock: 420, allocated: 315, unit: "kits" },
  { item: "Blankets", category: "Clothes", stock: 3100, allocated: 2740, unit: "pcs" },
  { item: "Tarpaulin Sheets", category: "Shelter", stock: 880, allocated: 610, unit: "pcs" },
];

export const distributions = [
  { id: "DST-771", camp: "Stadium Mega Shelter", items: "Food + Water", beneficiaries: 2310, status: "delivered", at: "1h ago" },
  { id: "DST-769", camp: "Govt High School Camp", items: "Medicine kits", beneficiaries: 742, status: "in-transit", at: "2h ago" },
  { id: "DST-764", camp: "Panchayat Bhavan Camp", items: "Blankets", beneficiaries: 190, status: "scheduled", at: "Today 18:00" },
];

export const alerts = [
  { id: "ALT-88", level: "critical" as const, title: "Red alert: Brahmani river above danger mark", body: "Immediate evacuation advised for Ward 9-14, Kendrapara. Move to designated shelters.", issuer: "State Disaster Authority", at: "9 min ago" },
  { id: "ALT-87", level: "warning" as const, title: "Cyclone landfall expected within 18 hours", body: "Wind speeds up to 145 km/h. Fishermen advised not to venture into the sea.", issuer: "IMD Regional Center", at: "1h ago" },
  { id: "ALT-86", level: "info" as const, title: "Additional relief convoy dispatched", body: "12 trucks carrying food and medicine en route to Pattamundai block.", issuer: "District Collectorate", at: "3h ago" },
];

export const emergencyContacts = [
  { name: "National Emergency Number", number: "112" },
  { name: "Disaster Management Helpline", number: "1078" },
  { name: "Ambulance", number: "108" },
  { name: "Fire Services", number: "101" },
  { name: "Women Helpline", number: "1091" },
  { name: "State Flood Control Room", number: "1800-345-7008" },
];

export const safetyGuides = [
  { title: "Flood", tips: ["Move to higher ground immediately", "Avoid walking through moving water", "Switch off mains electricity", "Carry documents in a waterproof bag"] },
  { title: "Earthquake", tips: ["Drop, cover and hold on", "Stay away from windows and heavy furniture", "Do not use elevators", "Expect aftershocks"] },
  { title: "Cyclone", tips: ["Secure loose objects outdoors", "Stock 3 days of water and food", "Stay indoors during the eye of the storm", "Follow only official bulletins"] },
  { title: "Fire", tips: ["Stay low to avoid smoke", "Use stairs, never elevators", "Feel doors before opening", "Assemble at the marked point"] },
];

export const requestTrend = [
  { hour: "00", rescue: 12, medical: 8, supplies: 20 },
  { hour: "04", rescue: 22, medical: 14, supplies: 26 },
  { hour: "08", rescue: 48, medical: 31, supplies: 44 },
  { hour: "12", rescue: 71, medical: 42, supplies: 61 },
  { hour: "16", rescue: 63, medical: 38, supplies: 72 },
  { hour: "20", rescue: 44, medical: 29, supplies: 55 },
  { hour: "24", rescue: 31, medical: 21, supplies: 40 },
];

export const responseTimes = [
  { day: "Mon", minutes: 42 },
  { day: "Tue", minutes: 38 },
  { day: "Wed", minutes: 33 },
  { day: "Thu", minutes: 29 },
  { day: "Fri", minutes: 24 },
  { day: "Sat", minutes: 21 },
  { day: "Sun", minutes: 18 },
];

export const resourceSplit = [
  { name: "Food", value: 38 },
  { name: "Water", value: 27 },
  { name: "Medicine", value: 19 },
  { name: "Shelter", value: 16 },
];

export const testimonials = [
  { quote: "ResQNet cut our average rescue dispatch time from 51 minutes to under 20 during the last flood cycle.", name: "Dr. R. Venkatesh", title: "District Collector, Coastal Command" },
  { quote: "For the first time our NGO inventory, the hospitals and the state control room were reading the same numbers.", name: "Meera Iyer", title: "Program Director, SahayataTrust" },
  { quote: "As a volunteer I get the nearest verified request with navigation. No more duplicated rescue trips.", name: "Arjun Mehta", title: "Boat Rescue Volunteer, 42 missions" },
];

export const platformStats = [
  { label: "Lives assisted", value: "1.2M+" },
  { label: "Avg. dispatch time", value: "18 min" },
  { label: "Agencies onboard", value: "340" },
  { label: "Uptime during events", value: "99.98%" },
];

export const aiModules = [
  { key: "damage", name: "AI Damage Assessment", desc: "Vision model grades structural damage from citizen photos and drone frames.", status: "Beta", metric: "94.2% agreement with field surveyors" },
  { key: "severity", name: "Disaster Severity Prediction", desc: "Fuses rainfall, river gauge, seismic and social signals into a 0-100 severity index.", status: "Live", metric: "6h forecast horizon" },
  { key: "priority", name: "Rescue Priority Prediction", desc: "Ranks open requests by survival risk, vulnerability and access difficulty.", status: "Live", metric: "Triage queue re-scored every 60s" },
  { key: "allocation", name: "Resource Allocation Suggestions", desc: "Optimises stock movement between NGO warehouses and camps.", status: "Beta", metric: "-23% wasted convoy km" },
  { key: "chat", name: "Emergency Chat Assistant", desc: "Multilingual assistant guiding citizens through SOS, first aid and shelter routing.", status: "Planned", metric: "11 Indian languages targeted" },
  { key: "summary", name: "Disaster Report Summarization", desc: "Generates situation reports for cabinet briefings from raw field logs.", status: "Planned", metric: "SITREP in under 30s" },
];

export const adminUsers = [
  { id: "USR-1204", name: "Anita Pradhan", role: "citizen", district: "Kendrapara", status: "verified" },
  { id: "USR-1188", name: "Arjun Mehta", role: "volunteer", district: "Kendrapara", status: "verified" },
  { id: "USR-1150", name: "SahayataTrust", role: "ngo", district: "Bhubaneswar", status: "pending" },
  { id: "USR-1101", name: "District HQ Hospital", role: "hospital", district: "Kendrapara", status: "verified" },
  { id: "USR-1002", name: "Collectorate Control Room", role: "government", district: "State", status: "verified" },
];

export const missions = [
  { id: "MSN-551", request: "REQ-90341", type: "Boat evacuation", people: 6, distanceKm: 3.2, status: "en-route", eta: "8 min" },
  { id: "MSN-548", request: "REQ-90322", type: "Shelter transfer", people: 11, distanceKm: 6.7, status: "assigned", eta: "24 min" },
  { id: "MSN-539", request: "REQ-90305", type: "Rooftop rescue", people: 2, distanceKm: 1.4, status: "completed", eta: "—" },
];

export const severityTone: Record<Severity, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-warning/15 text-warning border-warning/30",
  moderate: "bg-info/15 text-info border-info/30",
  low: "bg-success/15 text-success border-success/30",
};

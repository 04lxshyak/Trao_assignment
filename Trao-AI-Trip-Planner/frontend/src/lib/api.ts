import { getToken } from "./session";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export type BudgetType = "LOW" | "MEDIUM" | "HIGH";

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type Activity = {
  id: string;
  timeOfDay: string;
  title: string;
  description: string;
  category: string;
  estimatedCost: number;
};

export type ItineraryDay = {
  dayNumber: number;
  title: string;
  summary: string;
  activities: Activity[];
};

export type BudgetEstimate = {
  currency: string;
  flights: number;
  accommodation: number;
  food: number;
  activities: number;
  localTransport: number;
  miscellaneous: number;
  total: number;
  notes: string;
};

export type HotelSuggestion = {
  name: string;
  priceLevel: string;
  neighborhood: string;
  reason: string;
  estimatedNightlyRate: number;
  ratingHint: string;
};

export type TripQualityReview = {
  paceScore: number;
  budgetFit: string;
  interestMatch: string;
  restBalance: string;
  strengths: string[];
  warnings: string[];
  improvementIdeas: string[];
};

export type TripSummary = {
  id: string;
  destination: string;
  days: number;
  budgetType: BudgetType;
  interests: string[];
  createdAt: string;
  updatedAt: string;
};

export type Trip = TripSummary & {
  itinerary: ItineraryDay[];
  budgetEstimate: BudgetEstimate;
  hotels: HotelSuggestion[];
  qualityReview: TripQualityReview;
};

type RequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  auth?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (options.auth !== false) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message ?? "Request failed");
  }

  return payload as T;
}

export const api = {
  register: (body: { name: string; email: string; password: string }) =>
    apiRequest<AuthResponse>("/api/auth/register", { method: "POST", body, auth: false }),
  login: (body: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/api/auth/login", { method: "POST", body, auth: false }),
  listTrips: () => apiRequest<TripSummary[]>("/api/trips"),
  getTrip: (tripId: string) => apiRequest<Trip>(`/api/trips/${tripId}`),
  generateTrip: (body: { destination: string; days: number; budgetType: BudgetType; interests: string[] }) =>
    apiRequest<Trip>("/api/trips", { method: "POST", body }),
  regenerateDay: (tripId: string, dayNumber: number, instruction: string) =>
    apiRequest<Trip>(`/api/trips/${tripId}/days/${dayNumber}/regenerate`, {
      method: "POST",
      body: { instruction }
    }),
  addActivity: (
    tripId: string,
    dayNumber: number,
    body: { timeOfDay: string; title: string; description: string; category: string; estimatedCost: number }
  ) => apiRequest<Trip>(`/api/trips/${tripId}/days/${dayNumber}/activities`, { method: "POST", body }),
  removeActivity: (tripId: string, dayNumber: number, activityId: string) =>
    apiRequest<Trip>(`/api/trips/${tripId}/days/${dayNumber}/activities/${activityId}`, {
      method: "DELETE"
    }),
  deleteTrip: (tripId: string) => apiRequest<void>(`/api/trips/${tripId}`, { method: "DELETE" })
};

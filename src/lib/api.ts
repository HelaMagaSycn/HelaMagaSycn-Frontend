import type {
  ApiErrorBody,
  Booking,
  CreateBookingInput,
  JourneySearchResult,
  RegistrationInput,
  RegistrationResponse,
  StationOption,
  UserProfile,
} from "@/types/api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/backend";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function apiFetch<T>(path: string, init: RequestInit = {}, accessToken?: string): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: "no-store" });
  if (!response.ok) {
    let body: ApiErrorBody | undefined;
    try {
      body = (await response.json()) as ApiErrorBody;
    } catch {
      body = undefined;
    }
    throw new ApiError(body?.message ?? `Request failed with status ${response.status}`, response.status, body?.code);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  stations: () => apiFetch<StationOption[]>("/api/v1/search/stations"),
  searchJourneys: (originCode: string, destinationCode: string, travelDate: string) => {
    const query = new URLSearchParams({ originCode, destinationCode, travelDate });
    return apiFetch<JourneySearchResult[]>(`/api/v1/search/journeys?${query}`);
  },
  register: (input: RegistrationInput) =>
    apiFetch<RegistrationResponse>("/api/v1/users/registrations", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  profile: (token: string) => apiFetch<UserProfile>("/api/v1/users/me", {}, token),
  bookings: (token: string) => apiFetch<Booking[]>("/api/v1/bookings", {}, token),
  booking: (id: string, token: string) => apiFetch<Booking>(`/api/v1/bookings/${id}`, {}, token),
  createBooking: (input: CreateBookingInput, idempotencyKey: string, token: string) =>
    apiFetch<Booking>(
      "/api/v1/bookings",
      {
        method: "POST",
        headers: { "Idempotency-Key": idempotencyKey },
        body: JSON.stringify(input),
      },
      token,
    ),
};

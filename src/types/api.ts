export type TravelClass = "FIRST" | "SECOND" | "THIRD" | string;

export interface StationOption {
  code: string;
  name: string;
}

export interface AvailableSeat {
  seatId: string;
  coachCode: string;
  seatNumber: string;
  travelClass: TravelClass;
  available?: boolean;
}

export interface SeatAvailability extends AvailableSeat {
  available: boolean;
}

export interface JourneySearchResult {
  tripId: string;
  trainNumber: string;
  departureTime: string;
  originStationId: string;
  destinationStationId: string;
  fare: number;
  currency: string;
  availabilityAsOf: string;
  availableSeats: AvailableSeat[];
  seatMap?: SeatAvailability[];
}

export type BookingStatus =
  | "PENDING"
  | "SEAT_HELD"
  | "HOLD_EXPIRED"
  | "PAYMENT_AUTHORIZED"
  | "CONFIRMED"
  | "SEAT_UNAVAILABLE"
  | "PAYMENT_FAILED"
  | "REFUND_PENDING"
  | "REFUNDED"
  | "FAILED";

export interface Booking {
  id: string;
  tripId: string;
  seatId: string;
  originStationId: string;
  destinationStationId: string;
  quotedAmount: number | null;
  currency: string;
  status: BookingStatus;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingInput {
  tripId: string;
  seatId: string;
  originStationId: string;
  destinationStationId: string;
  paymentMethodToken: string;
  currency: string;
}

export interface UserProfile {
  id: string;
  nic: string;
  email: string;
  fullName: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationInput {
  nic: string;
  email: string;
  fullName: string;
}

export interface RegistrationResponse {
  registrationId: string;
  email: string;
  message: string;
}

export interface ApiErrorBody {
  code?: string;
  message?: string;
  details?: Record<string, string>;
}

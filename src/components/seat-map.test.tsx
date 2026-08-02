import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeatMap } from "@/components/seat-map";
import type { SeatAvailability } from "@/types/api";

const seats: SeatAvailability[] = [
  { seatId: "seat-1", coachCode: "R1", seatNumber: "1", travelClass: "FIRST", available: true },
  { seatId: "seat-2", coachCode: "R1", seatNumber: "2", travelClass: "FIRST", available: false },
];

describe("SeatMap", () => {
  it("selects an available window seat", () => {
    const onChange = vi.fn();
    render(<SeatMap availableSeats={[seats[0]]} seatMap={seats} selectedIds={[]} maximum={1} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /available seat 1, window/i }));

    expect(onChange).toHaveBeenCalledWith(["seat-1"]);
  });

  it("disables unavailable seats", () => {
    render(<SeatMap availableSeats={[seats[0]]} seatMap={seats} selectedIds={[]} maximum={1} onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: /unavailable seat 2/i })).toBeDisabled();
  });
});

import { describe, expect, it } from "vitest";
import { classLabel, formatMoney, titleCase } from "@/lib/format";

describe("format helpers", () => {
  it("formats LKR fares", () => expect(formatMoney(1500, "LKR")).toContain("1,500"));
  it("formats domain labels", () => {
    expect(titleCase("PAYMENT_AUTHORIZED")).toBe("Payment Authorized");
    expect(classLabel("FIRST")).toBe("First class");
  });
});

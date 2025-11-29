import { jest, describe, test, expect } from '@jest/globals';
import { createBooking, getAllBookings } from "../service/bookingService.js";

describe("bookingService", () => {
const mockDB = {
    query: jest.fn(),
};

test("✅ createBooking — успішне створення", async () => {
    const mockRow = { id: 1, name: "Test", date: "2024-01-01" };

    mockDB.query.mockResolvedValueOnce({ rows: [mockRow] });

    const result = await createBooking(mockDB, { name: "Test", date: "2024-01-01" });

    expect(result).toEqual(mockRow);
    expect(mockDB.query).toHaveBeenCalledTimes(1);
});

test("❌ createBooking — помилка при відсутності name", async () => {
    await expect(createBooking(mockDB, { name: "", date: "2024-01-01" }))
    .rejects
    .toThrow();
    });
});

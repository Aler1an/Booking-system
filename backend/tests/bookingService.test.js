import { jest } from '@jest/globals';
import { createBooking, getAllBookings } from "../service/bookingService.js";

const mockDB = {
    data: [],
    run: jest.fn(async function (query, params) {
    const [name, date] = params;
    if (!name || !date) throw new Error("Missing fields");
    const newItem = { id: this.data.length + 1, name, date };
    this.data.push(newItem);
    return { lastID: newItem.id };
    }),
    all: jest.fn(async function () {
    return this.data;
    }),
};

describe("bookingService", () => {
    beforeEach(() => {
    mockDB.data = []; // очищаємо базу перед кожним тестом
    });

    test("✅ createBooking — успішне створення", async () => {
    const booking = await createBooking(mockDB, {
        name: "John Doe",
        date: "2025-10-20",
    });

    expect(booking).toHaveProperty("id");
    expect(booking.name).toBe("John Doe");
    expect(mockDB.data.length).toBe(1);
    });

    test("❌ createBooking — помилка при відсутності name", async () => {
    await expect(
        createBooking(mockDB, { name: "", date: "2025-10-20" })
    ).rejects.toThrow();
    });
});

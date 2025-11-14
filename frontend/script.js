const API = "http://localhost:3000/bookings";

const bookingForm = document.getElementById("bookingForm");
const loadBtn = document.getElementById("loadBookingsBtn");
const list = document.getElementById("bookingsList");
const degradedBanner = document.getElementById("degraded");

let failureCount = 0;

// ---------------- LOAD BOOKINGS ----------------
async function loadBookings() {
  try {
    const res = await fetchWithResilience(API, {
      method: "GET",
      retry: { retries: 2, timeoutMs: 2000 }
    });

    const data = await res.json();

    failureCount = 0;
    degradedBanner.classList.add("hidden");

    list.innerHTML = "";
    data.forEach(b => {
      const li = document.createElement("li");
      li.textContent = `${b.name} — ${b.date}`;
      list.appendChild(li);
    });

  } catch (err) {
    failureCount++;
    if (failureCount >= 3) degradedBanner.classList.remove("hidden");
  }
}

// ---------------- ADD BOOKING ----------------
bookingForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;

  const payload = { name, date };
  const key = await getIdempotencyKey(payload);

  try {
    const res = await fetchWithResilience(API, {
      method: "POST",
      body: JSON.stringify(payload),
      idempotencyKey: key,
      retry: { retries: 3, timeoutMs: 3000 }
    });

    const data = await res.json();

    failureCount = 0;
    degradedBanner.classList.add("hidden");

    alert("Бронювання створено!");
    loadBookings();

  } catch (err) {
    failureCount++;
    if (failureCount >= 3) degradedBanner.classList.remove("hidden");
    alert("❌ Помилка");
  }
});

// Button
loadBtn.addEventListener("click", loadBookings);

const apiUrl = "http://localhost:3000/bookings";

async function loadBookings() {
  const res = await fetch(apiUrl);
  const bookings = await res.json();

  const list = document.getElementById("bookingsList");
  list.innerHTML = "";

  bookings.forEach(b => {
    const li = document.createElement("li");
    li.textContent = `${b.name} - ${b.date}`;
    list.appendChild(li);
  });
}

async function addBooking(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;

  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, date }),
  });

  const data = await res.json();
  alert(data.message || "Бронювання додано!");
  loadBookings();
}

document.getElementById("loadBookingsBtn").addEventListener("click", loadBookings);
document.getElementById("bookingForm").addEventListener("submit", addBooking);

async function addBooking() {
  const name = document.getElementById('name').value.trim();
  const date = document.getElementById('date').value;

  if (!name || !date) {
    alert('Будь ласка, заповніть усі поля!');
    return;
  }

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, date })
  });

  document.getElementById('name').value = '';
  document.getElementById('date').value = '';
  await loadBookings();
}

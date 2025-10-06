const API_URL = 'http://localhost:3000/bookings';

document.getElementById('loadBtn').addEventListener('click', loadBookings);
document.getElementById('addBtn').addEventListener('click', addBooking);

async function loadBookings() {
  const res = await fetch(API_URL);
  const bookings = await res.json();

  const list = document.getElementById('bookingList');
  list.innerHTML = '';
  bookings.forEach(b => {
    const li = document.createElement('li');
    li.textContent = `${b.name} — ${b.date}`;
    list.appendChild(li);
  });
}

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

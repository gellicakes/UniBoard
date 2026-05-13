document.addEventListener("DOMContentLoaded", () => {

  const monthYearEl = document.getElementById("month-year");
  const daysEl = document.getElementById("days");
  const eventDateEl = document.getElementById("event-date");
  const eventListEl = document.getElementById("event-list");

  const prevBtn = document.getElementById("prev-month");
  const nextBtn = document.getElementById("next-month");
  const todayBtn = document.getElementById("today-btn");
  const addBtn = document.getElementById("addBtn");

  let currentDate = new Date();
  let selectedDate = null;

  // LOAD EVENTS
  let events = JSON.parse(localStorage.getItem("events")) || {};

  function saveEvents() {
    localStorage.setItem("events", JSON.stringify(events));
  }

  function formatKey(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  function parseKey(key) {
    const [y, m, d] = key.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function formatReadableDate(date) {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  
  function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    monthYearEl.textContent = `${months[month]} ${year}`;

    let html = "";

    for (let i = 1; i <= lastDate; i++) {
      const date = new Date(year, month, i);
      const key = formatKey(date);

      let classes = "day";

      if (key === formatKey(new Date())) classes += " today";
      if (selectedDate && key === formatKey(selectedDate)) classes += " selected";
      if (events[key]) classes += " has-events";

      html += `<div class="${classes}" data-key="${key}">${i}</div>`;
    }

    daysEl.innerHTML = html;
  }

  function showEvents(dateKey) {
    const dateObj = parseKey(dateKey);
    eventDateEl.textContent = formatReadableDate(dateObj);

    eventListEl.innerHTML = "";

    if (!events[dateKey] || events[dateKey].length === 0) {
      eventListEl.innerHTML = `<div class="event-item">No events</div>`;
      return;
    }

    events[dateKey].forEach((ev) => {
      eventListEl.innerHTML += `
        <div class="event-item" data-id="${ev.id}" data-key="${dateKey}">

          <div class="event-content">
            <b>${ev.time}</b> - ${ev.text}
          </div>

          <div class="event-actions">
            <button class="open-btn">Open</button>
            <button class="delete-btn">Delete</button>
          </div>

        </div>
      `;
    });
  }

  function openEvent(id) {
    localStorage.setItem("selectedEventId", id);
    window.location.href = "eventdaw.html";
  }

  function deleteEvent(dateKey, id) {
    events[dateKey] = events[dateKey].filter(ev => ev.id !== id);

    if (events[dateKey].length === 0) {
      delete events[dateKey];
    }

    saveEvents();
    renderCalendar();
    showEvents(dateKey);
  }

  eventListEl.addEventListener("click", (e) => {

    const item = e.target.closest(".event-item");
    if (!item) return;

    const id = item.dataset.id;
    const dateKey = item.dataset.key;

    if (e.target.classList.contains("delete-btn")) {
      deleteEvent(dateKey, id);
      return;
    }

    if (e.target.classList.contains("open-btn")) {
      openEvent(id);
      return;
    }

  });

  daysEl.addEventListener("click", (e) => {
    const day = e.target.closest(".day");
    if (!day) return;

    const key = day.dataset.key;
    selectedDate = parseKey(key);

    renderCalendar();
    showEvents(key);
  });

  addBtn.addEventListener("click", () => {
  if (!selectedDate) {
    alert("Select a date first");
    return;
  }

  localStorage.setItem("selectedDate", formatKey(selectedDate));

  window.location.href = "addpost.html";
});

  prevBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  };

  nextBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  };

  todayBtn.onclick = () => {
    currentDate = new Date();
    selectedDate = new Date();
    renderCalendar();
  };

  renderCalendar();
});
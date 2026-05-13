let events = JSON.parse(localStorage.getItem("events")) || {};
let selectedDate = localStorage.getItem("selectedDate");

function saveEvent() {
  const text = document.getElementById("title").value;
  const time = document.getElementById("time").value;
  const details = document.getElementById("details").value;

  if (!events[selectedDate]) events[selectedDate] = [];

  events[selectedDate].push({
    id: Date.now().toString(),
    text,
    time,
    details,
    comments: []
  });

  localStorage.setItem("events", JSON.stringify(events));
}
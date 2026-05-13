let events = JSON.parse(localStorage.getItem("events")) || {};
let selectedId = localStorage.getItem("selectedEventId");

let eventObj;

for (let key in events) {
  let found = events[key].find(e => e.id === selectedId);
  if (found) {
    eventObj = found;
    break;
  }
}

document.getElementById("title").textContent = eventObj.text;
document.getElementById("time").textContent = eventObj.time;
document.getElementById("details").textContent = eventObj.details || "No details";

function render() {
  document.getElementById("comments").innerHTML =
    (eventObj.comments || []).map((c, index) => `
      <div class="comment-box">
        <p>${c.text}</p>

        <button onclick="showReplyBox(${index})">Reply</button>
        <button onclick="deleteComment(${index})">Delete</button>

        <div id="replyBox-${index}" style="display:none; margin-top:10px;">
          <textarea id="replyInput-${index}"></textarea>
          <button onclick="addReply(${index})">Post Reply</button>
        </div>

        <div class="replies">
          ${(c.replies || []).map(r => `
            <div class="reply-box">${r}</div>
          `).join("")}
        </div>
      </div>
    `).join("");
}

function addComment() {
  let text = document.getElementById("input").value;

  if (!eventObj.comments) eventObj.comments = [];

  eventObj.comments.push({
  text: text,
  replies: []
});

  localStorage.setItem("events", JSON.stringify(events));

  render();

  document.getElementById("input").value = "";
}

function showReplyBox(index) {
  let box = document.getElementById(`replyBox-${index}`);

  if (box.style.display === "none") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}

function addReply(index) {
  let input = document.getElementById(`replyInput-${index}`);
  let text = input.value;

  if (!eventObj.comments[index].replies) {
    eventObj.comments[index].replies = [];
  }

  eventObj.comments[index].replies.push(text);

  localStorage.setItem("events", JSON.stringify(events));

  render();
}

function deleteComment(index) {
  eventObj.comments.splice(index, 1);

  localStorage.setItem("events", JSON.stringify(events));

  render();
}
  
render();

const ROOM_NUMBER = document.getElementsByName("room-number")[0].getAttribute("content");
const MESSAGES_URL = "/api/rooms/" + ROOM_NUMBER + "/messages";
const MESSAGE_CONTAINER = document.getElementById("list-item-target");
const MESSAGE_TEXTAREA = document.getElementById("msg-textarea");

let currentIndex = -1;
let roomExists = true;

async function loadMessages() {
    let response = await fetch(MESSAGES_URL + "?position=" + currentIndex, {
        method: "GET",
        credentials: "same-origin",
    });

    if (response.status === 404) {
        roomExists = false;
        return [{sender: null, fromServer: true, message: "This chat room has been deleted."}]
    }

    try {
        let body = await response.json();
        currentIndex += body.length;

        return body;
    } catch (e) {
        return [{sender: null, fromServer: true, message: "An error occurred. Try again later."}]
    }
}

async function sendMessage(type, message) {
    let response = await fetch(MESSAGES_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
            type: type,
            message: message,
        })
    });

    if (!response.ok) {
        console.log(response.error)
    }
}

async function appendMessages(messages) {
    messages.forEach((message) => {
        if (!message['fromServer']) {
            MESSAGE_CONTAINER.innerHTML +=
                `<div class="list-item">
                    <span class="message-sender ${ message['isCurrentUser'] ? "current-user" : "" }">${message['sender']}:</span>
                    <span class="message-content">${message['message']}</span>
                </div>`;
        } else {
            MESSAGE_CONTAINER.innerHTML +=
                `<div class="list-placeholder">${message['message']}</div>`;
        }
    });
    if (messages.length > 0) MESSAGE_CONTAINER.scrollTop = MESSAGE_CONTAINER.scrollHeight;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendButtonPressed() {
    await sendMessage('message', MESSAGE_TEXTAREA.value);
    MESSAGE_TEXTAREA.value = "";
}

async function onPageLoad() {
    await sendMessage('hello', '');
    MESSAGE_CONTAINER.innerHTML = '';
    while (roomExists) {
        await appendMessages(await loadMessages());
        await sleep(1000)
    }
}

function onPageUnload() {
    sendMessage('goodbye', '');
    return undefined;
}

window.onbeforeunload = onPageUnload;
onPageLoad();

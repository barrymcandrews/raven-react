
async function populateRooms() {
    let roomContainer = document.getElementById("list-item-target");

    let request = {
        method: "GET",
        credentials: "same-origin"
    };
    let response = await fetch("/api/rooms", request);
    let respData = await response.json();
    let newHTML = "";
    respData.forEach((room) => {
        newHTML += `<div class="list-item list-button">
                        <a class="list-item" href="/rooms/${room['id']}">${room['name']}</a>
                        ${room['canDelete'] ? `
                            <a class="list-item" onclick="deleteRoom(${room['id']})" href="#">(Delete)</a>
                        ` : ``}
                    </div>`;
    });

    if (respData.length == 0) {
        newHTML = '<div class="list-placeholder">No chat rooms exist!</div>'
    }

    roomContainer.innerHTML = newHTML;

}

async function createRoom() {
    let roomNameInput = document.getElementById("room-name");

    if (roomNameInput.value.trim() == '') {
        return;
    }

    let data = {
        name: roomNameInput.value,
    };

    let request = {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        }
    };

    let response = await fetch('/api/rooms', request);
    await populateRooms();
}

async function deleteRoom(room) {
    let resp = await fetch("/api/rooms/" + room, {
        method: "DELETE",
        credentials: "same-origin",
    });

    if (resp.ok) {
        window.location.reload()
    }
}

populateRooms();
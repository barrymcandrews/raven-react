
async function submitForm(newAccount) {
    let messageLabel = document.getElementById("msg-label");
    let usernameInput = document.getElementById("form-un");
    let passwordInput = document.getElementById("form-pw");

    if (usernameInput.value.trim() == '' || passwordInput.value.trim() == '') {
        messageLabel.innerHTML = "You must provide a username and password";
        messageLabel.className = "text-sm error";
        return;
    }

    let data = {
        username: usernameInput.value,
        password: passwordInput.value,
        createNew: newAccount,
    };

    let request = {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json"
        }
    };

    let response = await fetch('/login', request);
    let respData = await response.json();

    if (response.ok && !newAccount) {
        window.location.href = '/'
    } else if ('message' in respData) {
        messageLabel.innerHTML = respData['message'];
        messageLabel.className = (!response.ok) ? "text-sm error" : "text-sm";
    } else {
        messageLabel.innerHTML = "Something went wrong. Try again later.";
        messageLabel.className = "text-sm error";
    }
}

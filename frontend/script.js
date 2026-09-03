const chat = document.getElementById("chat");
const input = document.getElementById("msg");
const send = document.getElementById("send");
const voice = document.getElementById("voice");

const typingStatus = document.getElementById("typingStatus");


// ===============================
// CLOCK
// ===============================

function updateClock() {

    const now = new Date();

    document.getElementById("systemTime")
        .textContent = now.toLocaleTimeString();

}

setInterval(updateClock, 1000);
updateClock();


// ===============================
// SYSTEM TELEMETRY
// ===============================

function updateTelemetry() {

    const cpu = Math.floor(Math.random() * 35) + 20;
    const memory = Math.floor(Math.random() * 25) + 35;
    const ping = Math.floor(Math.random() * 25) + 15;

    document.getElementById("cpu").textContent =
        cpu + "%";

    document.getElementById("memory").textContent =
        memory + "%";

    document.getElementById("ping").textContent =
        ping + "ms";

    document.getElementById("cpuBar").style.width =
        cpu + "%";

    document.getElementById("memoryBar").style.width =
        memory + "%";

    document.getElementById("networkBar").style.width =
        Math.min(ping, 100) + "%";
}

setInterval(updateTelemetry, 2500);


// ===============================
// NETWORK
// ===============================

function updateNetwork() {

    const online = navigator.onLine;

    const dot = document.getElementById("networkDot");
    const text = document.getElementById("networkText");

    if (online) {

        dot.style.background = "#00eaff";
        text.textContent = "ONLINE";

    } else {

        dot.style.background = "#ff4055";
        text.textContent = "OFFLINE";

    }

}

window.addEventListener("online", updateNetwork);
window.addEventListener("offline", updateNetwork);

updateNetwork();


// ===============================
// CHAT
// ===============================

function addMessage(text, type) {

    const message = document.createElement("div");

    message.className =
        "message " + type;

    const avatar = document.createElement("div");

    avatar.className = "avatar";

    avatar.textContent =
        type === "jarvis" ? "J" : "U";

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    bubble.textContent = text;

    message.appendChild(avatar);
    message.appendChild(bubble);

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;
}


// ===============================
// JARVIS RESPONSE ENGINE
// ===============================

function generateResponse(command) {

    const text = command.toLowerCase();

    if (
        text.includes("hello") ||
        text.includes("hi") ||
        text.includes("hey")
    ) {

        return "Hello. J.A.R.V.I.S is online and awaiting your instructions.";

    }

    if (text.includes("status")) {

        return "All primary systems are operational. AI core, network, voice engine and memory are currently active.";

    }

    if (
        text.includes("diagnostic") ||
        text.includes("diagnostics")
    ) {

        return "Running full system diagnostics. AI core nominal. Memory stable. Network connection stable. No critical errors detected.";

    }

    if (text.includes("time")) {

        return "The current system time is " +
            new Date().toLocaleTimeString();

    }

    if (text.includes("voice")) {

        return "Voice interface is ready. You may speak your command.";

    }

    if (
        text.includes("who are you") ||
        text.includes("your name")
    ) {

        return "I am J.A.R.V.I.S, your mobile artificial intelligence interface.";

    }

    if (
        text.includes("commands") ||
        text.includes("help")
    ) {

        return "Available commands include system status, diagnostics, time, voice mode and network status.";

    }

    if (text.includes("network")) {

        return navigator.onLine
            ? "Network connection is currently online."
            : "Network connection is currently offline.";

    }

    if (
        text.includes("thank")
    ) {

        return "You're welcome. Always at your service.";

    }

    return "Command received. I understand the request, but this demonstration interface requires an AI backend for advanced processing.";

}


// ===============================
// SEND COMMAND
// ===============================

async function processCommand() {

    const command = input.value.trim();

    if (!command) return;

    addMessage(command, "user");

    input.value = "";

    typingStatus.textContent = "PROCESSING...";

    await new Promise(resolve =>
        setTimeout(resolve, 700)
    );

    const response = generateResponse(command);

    typingStatus.textContent = "";

    addMessage(response, "jarvis");

    speak(response);
}


// ===============================
// SEND BUTTON
// ===============================

send.addEventListener(
    "click",
    processCommand
);


// ===============================
// ENTER KEY
// ===============================

input.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            processCommand();
        }

    }
);


// ===============================
// QUICK COMMANDS
// ===============================

function quickCommand(command) {

    input.value = command;

    processCommand();

}


// ===============================
// TEXT TO SPEECH
// ===============================

function speak(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 0.92;
    speech.pitch = 0.8;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
}


// ===============================
// VOICE RECOGNITION
// ===============================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";


    recognition.onstart = function () {

        voice.classList.add("listening");

        typingStatus.textContent =
            "LISTENING...";

    };


    recognition.onend = function () {

        voice.classList.remove("listening");

        typingStatus.textContent = "";

    };


    recognition.onresult = function (event) {

        const transcript =
            event.results[0][0].transcript;

        input.value = transcript;

        processCommand();

    };


    recognition.onerror = function () {

        voice.classList.remove("listening");

        typingStatus.textContent =
            "VOICE ERROR";

        setTimeout(() => {
            typingStatus.textContent = "";
        }, 1500);

    };


    voice.addEventListener(
        "click",
        () => {

            try {
                recognition.start();
            } catch (error) {
                console.log(error);
            }

        }
    );

} else {

    voice.addEventListener(
        "click",
        () => {

            addMessage(
                "Voice recognition is not supported by this browser.",
                "jarvis"
            );

        }
    );

}


// ===============================
// STARTUP SEQUENCE
// ===============================

setTimeout(() => {

    addMessage(
        "Diagnostics complete. All core modules initialized.",
        "jarvis"
    );

}, 1200);

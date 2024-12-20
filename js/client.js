const socket = io("https://mychat-8fy5.onrender.com");

const form = document.querySelector('.message-form');
const messageInput = document.getElementById('message-sent');
const messageContainer = document.querySelector('.chat-container');
const audio = new Audio("ting.mp3");

// Function to append a message to the chat container
const append = (message, position, position2) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add('message'); 
    messageElement.classList.add(position); 
    messageElement.classList.add(position2); 
    messageContainer.append(messageElement);

    // Play sound only if it's not already playing
    if (position === 'message-user1' && audio.paused) {
        audio.play().catch(error => console.error('Audio play error:', error));
    }
};

// Show prompt modal
document.getElementById('prompt-modal').style.display = 'block';

document.getElementById('submit-username').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        socket.emit("new-user-joined", username);
        document.getElementById('prompt-modal').style.display = 'none';
    } else {
        alert("Please enter your name before joining the chat.");
    }
});

socket.on("user-joined", (data) => {
    append(`${data} joined the chat.`, 'message-user2', 'textr');
});

socket.on("receive", (data) => {
    append(`${data.name}: ${data.message}`, 'message-user1', 'textl');
});

socket.on("left", (data) => {
    append(`${data.name} left the chat`, 'message-user1', 'textl');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message) { 
        append(`You: ${message}`, 'message-user2', 'textr');
        socket.emit("send", message);
        messageInput.value = ''; 
    }
});

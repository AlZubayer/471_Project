const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

let fromUser = "John";
let toUser = "Maria";

// Listen for the submit event of the chat form
chatForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevents default form submission
    const msg = e.target.elements.msg.value; // Get the message from the input field

    // Emit the chat message to the server with sender and receiver details
    socket.emit('chatMessage', {
        fromUser: fromUser,
        toUser: toUser,
        message: msg
    });

    document.getElementById('msg').value = ""; // Clear the message input
});

// Emit user details to server when setting up the chat
function storeDetails() {
    fromUser = document.getElementById('from').value;
    toUser = document.getElementById('to').value;

    // Emit user details to the server for session setup
    socket.emit('userDetails', { fromUser, toUser });
}

// Listen for incoming messages from the server
socket.on('output', (data) => {
    console.log(data);
    // Display all previous chat history
    data.forEach((message) => {
        outputMessage(message);
    });
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Listen for the message event and display the incoming message
socket.on('message', (data) => {
    outputMessage(data);
    console.log(data);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Function to display the chat messages in the UI
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
        <p class="meta">${message.from}<span> ${message.time}</span></p>
        <p class="text">${message.message}</p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

const messageBoard = document.getElementById('message-board');
const chatForm = document.getElementById('chat-form');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message-input');

// 1. Function to fetch messages
async function loadMessages() {
    try {
        const response = await fetch('/.netlify/functions/get-messages');
        const messages = await response.json();
        
        messageBoard.innerHTML = ''; // Clear loading text
        
        messages.forEach(msg => {
            const div = document.createElement('div');
            const isMe = msg.username === usernameInput.value;
            div.className = `msg ${isMe ? 'my-msg' : 'other-msg'}`;
            div.innerHTML = `<strong>${msg.username}</strong> ${msg.content}`;
            messageBoard.appendChild(div);
        });

        // Auto-scroll to bottom
        messageBoard.scrollTop = messageBoard.scrollHeight;
    } catch (err) {
        console.error("Error loading messages:", err);
    }
}

// 2. Handle Sending
chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value;
    const content = messageInput.value;

    // Optimistic UI: Show message immediately before server confirms (optional)
    // For now, let's just clear the input
    messageInput.value = '';

    await fetch('/.netlify/functions/send-message', {
        method: 'POST',
        body: JSON.stringify({ username, content })
    });

    loadMessages(); // Refresh list
});

// 3. Load on start and poll every 3 seconds
loadMessages();
setInterval(loadMessages, 3000);
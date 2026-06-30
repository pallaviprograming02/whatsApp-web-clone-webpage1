// Mock Data for Chats
const chatsData = [
    {
        id: 1,
        name: 'Alice',
        avatar: 'https://ui-avatars.com/api/?name=Alice&background=4CAF50&color=fff&rounded=true',
        lastMessage: 'Hey! How are you doing?',
        time: '10:45 AM',
        messages: [
            { text: 'Hi Alice!', sender: 'sent', time: '10:40 AM' },
            { text: 'Hey! How are you doing?', sender: 'received', time: '10:45 AM' }
        ]
    },
    {
        id: 2,
        name: 'Bob',
        avatar: 'https://ui-avatars.com/api/?name=Bob&background=FF9800&color=fff&rounded=true',
        lastMessage: 'Let\'s catch up later.',
        time: 'Yesterday',
        messages: [
            { text: 'Are we still on for today?', sender: 'sent', time: 'Yesterday' },
            { text: 'Sorry, I am a bit busy.', sender: 'received', time: 'Yesterday' },
            { text: 'Let\'s catch up later.', sender: 'received', time: 'Yesterday' }
        ]
    },
    {
        id: 3,
        name: 'Charlie',
        avatar: 'https://ui-avatars.com/api/?name=Charlie&background=E91E63&color=fff&rounded=true',
        lastMessage: 'Sent an attachment',
        time: 'Tuesday',
        messages: [
            { text: 'Did you check the file?', sender: 'received', time: 'Tuesday' },
            { text: 'Yes, it looks good.', sender: 'sent', time: 'Tuesday' }
        ]
    },
    {
        id: 4,
        name: 'Work Group',
        avatar: 'https://ui-avatars.com/api/?name=Work+Group&background=607D8B&color=fff&rounded=true',
        lastMessage: 'David: Meeting at 3 PM.',
        time: 'Monday',
        messages: [
            { text: 'Team, don\'t forget our sync.', sender: 'received', time: 'Monday' },
            { text: 'Meeting at 3 PM.', sender: 'received', time: 'Monday' }
        ]
    }
];

let currentChatId = null;

// DOM Elements
const chatListEl = document.getElementById('chatList');
const messagesContainer = document.getElementById('messagesContainer');
const currentChatName = document.getElementById('currentChatName');
const currentChatAvatar = document.getElementById('currentChatAvatar');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const sendIcon = document.getElementById('sendIcon');
const searchInput = document.getElementById('searchInput');

// Initialize the App
function init() {
    renderChatList(chatsData);
    setupEventListeners();
}

// Render the sidebar chat list
function renderChatList(chats) {
    chatListEl.innerHTML = '';
    
    if(chats.length === 0) {
        chatListEl.innerHTML = '<p style="text-align:center; padding: 20px; color: #667781;">No chats found.</p>';
        return;
    }

    chats.forEach(chat => {
        const isActive = chat.id === currentChatId ? 'active' : '';
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${isActive}`;
        chatItem.onclick = () => loadChat(chat.id);
        
        chatItem.innerHTML = `
            <img src="${chat.avatar}" alt="${chat.name}" class="avatar">
            <div class="chat-item-info">
                <div class="chat-item-header">
                    <h3>${chat.name}</h3>
                    <span class="chat-time">${chat.time}</span>
                </div>
                <p class="chat-message-preview">${chat.lastMessage}</p>
            </div>
        `;
        chatListEl.appendChild(chatItem);
    });
}

// Load a specific chat into the main area
function loadChat(chatId) {
    currentChatId = chatId;
    const chat = chatsData.find(c => c.id === chatId);
    
    if (!chat) return;

    // Show active chat area, hide welcome screen
    const welcomeScreen = document.getElementById('welcomeScreen');
    const activeChatArea = document.getElementById('activeChatArea');
    if (welcomeScreen && activeChatArea) {
        welcomeScreen.style.display = 'none';
        activeChatArea.style.display = 'flex';
    }

    // Update Header
    currentChatName.textContent = chat.name;
    currentChatAvatar.src = chat.avatar;

    // Render Messages
    messagesContainer.innerHTML = '';
    chat.messages.forEach(msg => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message message-${msg.sender}`;
        msgDiv.innerHTML = `
            ${msg.text}
            <span class="message-time">${msg.time}</span>
        `;
        messagesContainer.appendChild(msgDiv);
    });

    // Scroll to bottom
    scrollToBottom();

    // Re-render chat list to update active state
    renderChatList(chatsData);
}

// Send a new message
function sendMessage() {
    const text = messageInput.value.trim();
    if (text === '') return;

    const chat = chatsData.find(c => c.id === currentChatId);
    
    // Create new message object
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newMessage = {
        text: text,
        sender: 'sent',
        time: timeString
    };

    // Add to data
    chat.messages.push(newMessage);
    chat.lastMessage = text;
    chat.time = timeString;

    // Clear input
    messageInput.value = '';
    updateSendIcon();

    // Update UI
    loadChat(currentChatId);
    
    // Move chat to top of list
    const chatIndex = chatsData.indexOf(chat);
    if(chatIndex > 0) {
        chatsData.splice(chatIndex, 1);
        chatsData.unshift(chat);
        renderChatList(chatsData);
    }
}

// Scroll chat to the bottom
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Update the send button icon based on input
function updateSendIcon() {
    if (messageInput.value.trim().length > 0) {
        sendIcon.className = 'fas fa-paper-plane';
    } else {
        sendIcon.className = 'fas fa-microphone';
    }
}

// Filter chats based on search
function filterChats(query) {
    const filtered = chatsData.filter(chat => 
        chat.name.toLowerCase().includes(query.toLowerCase()) || 
        chat.lastMessage.toLowerCase().includes(query.toLowerCase())
    );
    renderChatList(filtered);
}

// Setup all event listeners
function setupEventListeners() {
    // Input changes icon
    messageInput.addEventListener('input', updateSendIcon);
    
    // Enter key to send
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Send button click
    sendBtn.addEventListener('click', () => {
        if (messageInput.value.trim().length > 0) {
            sendMessage();
        }
    });

    // Search input
    searchInput.addEventListener('input', (e) => {
        filterChats(e.target.value);
    });
}

// Start the app
init();

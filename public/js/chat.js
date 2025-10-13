// This code runs in the user's browser
document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selection ---
    const chatPopup = document.getElementById('chat-popup');
    const openChatFab = document.getElementById('open-chat-fab');
    const closeChat = document.getElementById('close-chat');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    // --- Event Listeners to toggle chat visibility ---
    openChatFab.addEventListener('click', () => {
        chatPopup.classList.remove('hidden');
        openChatFab.classList.add('hidden');
    });

    closeChat.addEventListener('click', () => {
        chatPopup.classList.add('hidden');
        openChatFab.classList.remove('hidden');
    });

    /**
     * Creates and appends a new message bubble to the chat interface.
     * @param {string} sender - Who sent the message ('user' or 'ai').
     * @param {string} message - The message text.
     */
    function addMessage(sender, message) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message', 'mb-4', 'flex');

        let messageBubble;

        if (sender === 'user') {
            // User message (aligned to the right)
            messageWrapper.classList.add('justify-end');
            messageBubble = `
                <div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg max-w-xs md:max-w-md">
                    <p>${message}</p>
                </div>
            `;
        } else {
            // AI message (aligned to the left)
            messageBubble = `
                <div class="flex-shrink-0 mr-3">
                    <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold text-sm">AI</div>
                </div>
                <div class="bg-slate-200 text-slate-800 p-3 rounded-r-lg rounded-bl-lg max-w-xs md:max-w-md">
                    <p>${message}</p>
                </div>
            `;
        }
        
        messageWrapper.innerHTML = messageBubble;
        chatMessages.appendChild(messageWrapper);
        // Automatically scroll to the newest message
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }


    // --- Form Submission Logic ---
    chatForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission (page reload)

        const userQuestion = chatInput.value.trim();
        if (!userQuestion) return; // Don't send empty messages

        // 1. Immediately display the user's message
        addMessage('user', userQuestion);
        chatInput.value = ''; // Clear the input field

        // 2. Display a temporary "thinking..." message
        addMessage('ai', '<span class="italic text-slate-500">Thinking...</span>');

        try {
            // 3. Send the question to our backend server
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question: userQuestion }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();
            
            // 4. Remove the "thinking..." message and add the real AI response
            chatMessages.lastChild.remove(); 
            addMessage('ai', data.answer);

        } catch (error) {
            console.error('Error:', error);
            // If an error occurs, replace "thinking..." with an error message
            chatMessages.lastChild.remove();
            addMessage('ai', 'Oops! Something went wrong. Please try again.');
        }
    });
});
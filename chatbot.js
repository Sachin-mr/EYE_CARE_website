document.addEventListener("DOMContentLoaded", () => {
    // Create chatbot UI
    const chatbotHTML = `
        <div class="chat-icon">
            <i class="fas fa-comment"></i>
        </div>
        <div class="chat-container">
            <div class="chat-header">
                <h2>Chatbot</h2>
                <span class="close-btn">&times;</span>
            </div>
            <div class="chat-box">
                <div class="chat-message bot-message">
                    <p>Hello! How can I help you today?</p>
                </div>
            </div>
            <div class="chat-input">
                <input type="text" placeholder="Type your message...">
                <button>Send</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const chatIcon = document.querySelector(".chat-icon");
    const chatContainer = document.querySelector(".chat-container");
    const closeBtn = document.querySelector(".close-btn");
    const chatBox = document.querySelector(".chat-box");
    const chatInput = document.querySelector(".chat-input input");
    const sendBtn = document.querySelector(".chat-input button");

    let isChatOpen = false;

    // Toggle chat window
    chatIcon.addEventListener("click", () => {
        if (isChatOpen) {
            chatContainer.style.display = "none";
        } else {
            chatContainer.style.display = "flex";
        }
        isChatOpen = !isChatOpen;
    });

    closeBtn.addEventListener("click", () => {
        chatContainer.style.display = "none";
        isChatOpen = false;
    });

    // Send message
    const sendMessage = async () => {
        const userMessage = chatInput.value.trim();
        if (userMessage === "") return;

        // Add user message to chat box
        const userMessageElement = document.createElement("div");
        userMessageElement.classList.add("chat-message", "user-message");
        userMessageElement.innerHTML = `<p>${userMessage}</p>`;
        chatBox.appendChild(userMessageElement);
        chatInput.value = "";

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;

        // Get bot response
        const botMessage = await getBotResponse(userMessage);

        // Add bot message to chat box
        const botMessageElement = document.createElement("div");
        botMessageElement.classList.add("chat-message", "bot-message");
        botMessageElement.innerHTML = `<p>${botMessage}</p>`;
        chatBox.appendChild(botMessageElement);

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    // Get bot response from Gemini API
    const  GEMINI_API_KEY = "AIzaSyDlSCzDL5r5mCqFiEWkZ4gI_90lOPhR6gU";

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

        // Add the website's context to the prompt
        const prompt = `
            The user is asking a question about the website with the following content:
            ${websiteContent}

            User's question:
            ${userMessage}
        `;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt,
                        }, ],
                    }, ],
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch bot response.");
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error)
        {
            console.error(error);
            return "Sorry, I'm having trouble connecting to the chatbot service. Please check your API key and try again later.";
        }
    };
});

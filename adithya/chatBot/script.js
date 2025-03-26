const API_KEY = "AIzaSyCNze-P3HZUZCwYhxuKDQUSXoNin3VE8as"; // Make sure the API key is correct!

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatBox = document.getElementById("chat-box");

    if (userInput.trim() === "") return;

    // Display the user message
    chatBox.innerHTML += `<div><strong>You:</strong> ${userInput}</div>`;
    document.getElementById("user-input").value = "";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: userInput }] }],
                }),
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error.message);
            chatBox.innerHTML += `<div><strong>Bot:</strong> Error: ${data.error.message}</div>`;
        } else if (data.candidates && data.candidates.length > 0) {
            const botMessage = data.candidates[0].content.parts[0].text;
            chatBox.innerHTML += `<div><strong>Bot:</strong> ${botMessage}</div>`;
        } else {
            chatBox.innerHTML += `<div><strong>Bot:</strong> Hmm... no response from the server.</div>`;
        }

    } catch (error) {
        console.error("Request failed:", error);
        chatBox.innerHTML += `<div><strong>Bot:</strong> Connection error. Please try again later.</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

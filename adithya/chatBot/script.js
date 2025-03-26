async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatBox = document.getElementById("chat-box");

    if (userInput.trim() === "") return;

    // Display user message
    chatBox.innerHTML += `<div><strong>You:</strong> ${userInput}</div>`;
    document.getElementById("user-input").value = "";

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCNze-P3HZUZCwYhxuKDQUSXoNin3VE8as", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: userInput }] }]
            })
        });

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            const botMessage = data.candidates[0].content.parts[0].text;
            chatBox.innerHTML += `<div><strong>Bot:</strong> ${botMessage}</div>`;
        } else {
            chatBox.innerHTML += `<div><strong>Bot:</strong> Oops! Something went wrong.</div>`;
        }

    } catch (error) {
        console.error("Error:", error);
        chatBox.innerHTML += `<div><strong>Bot:</strong> Error connecting to API.</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

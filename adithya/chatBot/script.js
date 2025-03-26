const API_KEY = "AIzaSyCNze-P3HZUZCwYhxuKDQUSXoNin3VE8as";

async function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    const chatBox = document.getElementById("chat-box");

    if (userInput.trim() === "") return;

    // Display the user's message
    chatBox.innerHTML += `<div class="user-message"><strong>You:</strong> ${userInput}</div>`;
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
            chatBox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> Error: ${data.error.message}</div>`;
        } else if (data.candidates && data.candidates.length > 0) {
            const botMessage = data.candidates[0].content.parts[0].text;

            // Apply text formatting to break the message into readable sections
            let formattedMessage = formatBotResponse(botMessage);

            chatBox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> ${formattedMessage}</div>`;
        } else {
            chatBox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> Hmm... no response from the server.</div>`;
        }

    } catch (error) {
        console.error("Request failed:", error);
        chatBox.innerHTML += `<div class="bot-message"><strong>Bot:</strong> Connection error. Please try again later.</div>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to format the bot's response for better readability
function formatBotResponse(response) {
    // Check if the response contains questions or lists to format
    let formattedResponse = response;

    // Example: breaking up long paragraphs into bullet points
    if (formattedResponse.includes("1.") || formattedResponse.includes("2.")) {
        formattedResponse = formattedResponse
            .replace(/(\d+\.)/g, '<br><br><strong>$1</strong>') // Add line breaks and bold section titles
            .replace(/\*/g, '<ul><li>') // Add unordered list for bullet points
            .replace(/\n/g, '</li><li>') // Ensure each new line is a list item
            + '</ul>';
    }

    // You can add more complex parsing here based on the structure of your responses

    return formattedResponse;
}

// Add event listener for "Enter" key to trigger sendMessage
document.getElementById("user-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();  // Prevent form submission
        sendMessage();  // Call the sendMessage function
    }
});

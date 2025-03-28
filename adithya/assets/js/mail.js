document.getElementById("contactForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    const mailgunDomain = "adithyavarma.xyz";
    const mailgunAPIKey = "5937ec61a541c40e81673554152b1b8b-f6202374-78071449"; // Replace with your API key

    const url = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;

    const formBody = new URLSearchParams();
    formBody.append("from", `Adithya Varma<contact@${mailgunDomain}>`);
    formBody.append("to", "durgaadithyavarma.bh@gmail.com");
    formBody.append("subject", subject);
    formBody.append("text", `From: ${name} (${email})\n\n${message}`);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": "Basic " + btoa("api:" + mailgunAPIKey),
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formBody,
        });

        if (response.ok) {
            document.getElementById("statusMessage").textContent = "Email sent successfully!";
            event.target.reset(); // Reset form fields
        } else {
            document.getElementById("statusMessage").textContent = "Failed to send email.";
        }
    } catch (error) {
        document.getElementById("statusMessage").textContent = "Error: " + error.message;
    }
});

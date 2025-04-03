document.getElementById("reservation-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const dateOfReservation = document.getElementById("date").value;
    const numberOfPeople = document.getElementById("guests").value;

    const response = await fetch("https://adithyavarma-xyz.onrender.com/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, dateOfReservation, numberOfPeople })
    });

    const result = await response.json();
    alert(result.message);
});

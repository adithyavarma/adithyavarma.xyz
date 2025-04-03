const apiUrl = "https://adithyavarma-xyz.onrender.com";

//fetch and display reservations
async function fetchReservations() {
    const response = await fetch(`${apiUrl}/reservations`);
    const reservations = await response.json();

    const table = document.getElementById("reservations-table");

    reservations.forEach(res => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${res.name}</td>
            <td>${res.phone}</td>
            <td>${res.date_of_reservation}</td>
            <td>${res.number_of_people}</td>
            <td>${res.reservedBy}</td>
            <td>
                <select onchange="updateReservation(${res.id}, this.value)">
                    <option value="false" ${!res.confirmed ? "selected" : ""}>Pending</option>
                    <option value="true" ${res.confirmed ? "selected" : ""}>Confirmed</option>
                </select>
            </td>
        `;
    });
}

//update reservation status
async function updateReservation(id, status) {
    await fetch(`${apiUrl}/reservation/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: status === "true" })
    });
    alert("Reservation updated!");
}

//add new reservations
document.getElementById("add-reservation-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const dateOfReservation = document.getElementById("date").value;
    const numberOfPeople = document.getElementById("guests").value;
    const reservedBy = document.getElementById("reservedBy").value;

    const response = await fetch(`${apiUrl}/reserve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, dateOfReservation, numberOfPeople, reservedBy })
    });

    const result = await response.json();
    alert(result.message);
    location.reload(); // Refresh list after adding
});

fetchReservations();

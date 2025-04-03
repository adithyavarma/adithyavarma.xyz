const apiUrl = "https://your-render-app-url.onrender.com";

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
            <td>
                <select onchange="updateReservation(${res.id}, this.value)">
                    <option value="false" ${!res.confirmed ? "selected" : ""}>Pending</option>
                    <option value="true" ${res.confirmed ? "selected" : ""}>Confirmed</option>
                </select>
            </td>
        `;
    });
}

async function updateReservation(id, status) {
    await fetch(`${apiUrl}/reservation/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: status === "true" })
    });
    alert("Reservation updated!");
}

fetchReservations();

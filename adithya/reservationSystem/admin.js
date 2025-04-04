const apiUrl = "https://adithyavarma-xyz.onrender.com";

//fetch and display reservations
async function fetchReservations() {
    const response = await fetch(`${apiUrl}/reservations`);
    const reservations = await response.json();

    const table = document.getElementById("reservations-table");
    table.innerHTML = `<tr>
        <th>Customer Name</th>
        <th>Phone</th>
        <th>Date</th>
        <th>Guests</th>
        <th>Reserved By</th>
        <th>Status</th>
        <th>Update</th>
    </tr>`;

    reservations.forEach(res => {
        const row = table.insertRow();
        row.innerHTML = `
            <td>${res.name}</td>
            <td>${res.phone}</td>
            <td>${res.date_of_reservation.split("T")[0]}</td>
            <td>${res.number_of_people}</td>
            <td>${res.reservedBy}</td>
            <td>
                <select id="status-${res.id}" onchange="updateReservation(${res.id})">
                     <option value="pending" ${res.status === "pending" ? "selected" : ""}>Pending</option>
                     <option value="confirmed" ${res.status === "confirmed" ? "selected" : ""}>Confirmed</option>
                     <option value="canceled" ${res.status === "canceled" ? "selected" : ""}>Canceled</option>
                </select>
            </td>
            <td><a href="#" onclick = "updateReservation(${res.id})">Update</a></td>
        `;
    });
}

//update reservation status
//async function updateReservation(id, status) {
//    await fetch(`${apiUrl}/reservation/${id}`, {
//        method: "PUT",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ confirmed: status === "true" })
//    });
//    alert("Reservation updated!");
//}

async function updateReservation(id) {
    const newStatus = document.getElementById(`status-${id}`).value;
    const response = await fetch(`${apiUrl}/update-reservation/${id}/${newStatus}`, { method: "GET" });

    if (response.ok) {
        alert("Reservation updated successfully!");
        location.reload(); // Refresh the list after update
    } else {
        alert("Failed to update reservation.");
    }
}
//
////add new reservations
//document.getElementById("add-reservation-form").addEventListener("submit", async function(event) {
//    event.preventDefault();
//
//    const name = document.getElementById("name").value;
//    const phone = document.getElementById("phone").value;
//    const dateOfReservation = document.getElementById("date").value;
//    const numberOfPeople = document.getElementById("guests").value;
//    const reservedBy = document.getElementById("reservedBy").value;
//    const status = document.getElementById("status").value;
//    const response = await fetch(`${apiUrl}/reserve`, {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify({ name, phone, dateOfReservation, numberOfPeople, reservedBy })
//    });
//
//    const result = await response.json();
//    alert(result.message);
//    location.reload(); // Refresh list after adding
//});

fetchReservations();

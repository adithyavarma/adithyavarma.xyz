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
            <td>${new Date(res.date_of_reservation).toLocaleString()}</td>
            <td>${res.number_of_people}</td>
            <td>${res.reservedBy}</td>
            <td>
                <select id="status-${res.id}">
                     <option value="pending" ${res.status === "pending" ? "selected" : ""}>Pending</option>
                     <option value="confirmed" ${res.status === "confirmed" ? "selected" : ""}>Confirmed</option>
                     <option value="canceled" ${res.status === "canceled" ? "selected" : ""}>Canceled</option>
                </select>
            </td>
            <td><a href="#" onclick = "updateReservation(${res.id})" id="update-btn-${res.id}">Update</a></td>
        `;
    });
}

async function updateReservation(id) {
    const newStatus = document.getElementById(`status-${id}`).value;
    const updateButton = document.getElementById(`update-btn-${id}`);

//    updateButton.textContent = "Updating...";
    updateButton.disabled = true;

    try{
        const response = await fetch(`${apiUrl}/update-reservation/${id}/${newStatus}`, { method: "PUT" });
        if (response.ok) {
            alert("Reservation updated successfully!");
            location.reload(); // Refresh the list after update
        } else {
            alert("Failed to update reservation.");
        }
    }catch (error) {
             alert("Error updating reservation: " + error.message);
    } finally {
             updateButton.textContent = "Update";
             updateButton.disabled = false;
        }
}


fetchReservations();

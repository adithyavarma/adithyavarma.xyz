require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

const corsOptions={
    origin: "https://adithyavarma.xyz",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.options("*", cors(corsOptions)); // Enable pre-flight requests for all routes
// Middleware


// PostgreSQL Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }  // Required for Neon
});

// 📌 Route to create a reservation
app.post("/reserve", async (req, res) => {
    const { name, phone, dateOfReservation, numberOfPeople, reservedBy } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO reservations (name, phone, date_of_reservation, number_of_people, reservedBy, status) VALUES ($1, $2, $3, $4, $5, 'CONFIRMED') RETURNING *",
            [name, phone, dateOfReservation, numberOfPeople, reservedBy, status]
        );
        res.status(201).json({ message: "Reservation created!", data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Route to get all reservations
app.get("/reservations", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM reservations ORDER BY date_of_reservation");
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 Route to update reservation (Receptionist Access)
app.put("/update-reservation/:id/:status", async (req, res) => {
    const { id, status } = req.params;

    try {
        const allowedStatuses = ["PENDING", "CONFIRMED", "CANCELED"];
        if(!allowedStatuses.includes(status.toLowerCase())) {
            return res.status(400).json({ error: "Invalid status" });
        }
        const result = await pool.query(
            "UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.json({ message: `Reservation updated to ${status}!`, data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

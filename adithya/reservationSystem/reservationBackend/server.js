require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

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
            "INSERT INTO reservations (name, phone, date_of_reservation, number_of_people, reservedBy) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, phone, dateOfReservation, numberOfPeople, reservedBy]
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
app.put("/reservation/:id", async (req, res) => {
    const { id } = req.params;
    const { confirmed } = req.body;

    try {
        const result = await pool.query(
            "UPDATE reservations SET confirmed = $1 WHERE id = $2 RETURNING *",
            [confirmed, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        res.json({ message: "Reservation updated!", data: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

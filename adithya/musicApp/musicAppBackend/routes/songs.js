const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add a new song to a playlist
router.post('/', async (req, res) => {
    const { playlist_id, title, artist, url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO songs (playlist_id, title, artist, url) VALUES ($1, $2, $3, $4) RETURNING *',
            [playlist_id, title, artist, url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all songs in a specific playlist
router.get('/playlist/:playlist_id', async (req, res) => {
    const { playlist_id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM songs WHERE playlist_id = $1', [playlist_id]);
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update song details
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, artist, url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE songs SET title = $1, artist = $2, url = $3 WHERE id = $4 RETURNING *',
            [title, artist, url, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a song from a playlist
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM songs WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Song not found' });
        }
        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

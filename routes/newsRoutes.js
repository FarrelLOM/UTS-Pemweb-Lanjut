const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Ambil semua laporan sebagai berita komunitas
router.get('/news', (req, res) => {
  const sql = `
    SELECT title, region, category, description, image, geo_link
    FROM reports
    ORDER BY reported_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

module.exports = router;
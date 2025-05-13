const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Ambil semua titik mikrogrid (untuk ditampilkan di peta)
router.get('/mikrogrid', (req, res) => {
  const query = 'SELECT name, lat, lon FROM microgrids';

  db.query(query, (err, rows) => {
    if (err) {
      console.error('❌ Gagal ambil data mikrogrid:', err);
      return res.status(500).json([]);
    }

    res.json(rows);
  });
});

// (Opsional) Tambahkan titik mikrogrid dari geo_link seller
function parseCoordinates(url) {
  const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  return match ? { lat: parseFloat(match[1]), lon: parseFloat(match[2]) } : null;
}

router.post('/add-microgrid', (req, res) => {
  const userId = req.session.user?.id;
  const { name, geo_link } = req.body;

  if (!userId || !geo_link) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const coords = parseCoordinates(geo_link);
  if (!coords) {
    return res.status(400).json({ message: 'Link Google Maps tidak valid' });
  }

  const insert = `
    INSERT INTO microgrids (name, lat, lon, user_id)
    VALUES (?, ?, ?, ?)
  `;

  db.query(insert, [name, coords.lat, coords.lon, userId], (err) => {
    if (err) {
      console.error('❌ Gagal simpan titik mikrogrid:', err);
      return res.status(500).json({ message: 'Gagal simpan mikrogrid' });
    }

    console.log(`📌 Titik mikrogrid ditambahkan: ${name} (${coords.lat}, ${coords.lon})`);
    res.json({ success: true });
  });
});

module.exports = router;
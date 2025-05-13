const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Kinerja pembangkit milik user
router.get('/dashboard-user/data', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  // Ambil histori kWh dari tabel energy_production
  const query = `
    SELECT timestamp, energy_kwh FROM energy_production
    WHERE user_id = ?
    ORDER BY timestamp DESC LIMIT 24
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    const kwh_history = results.map(r => ({
      timestamp: r.timestamp,
      kwh: r.energy_kwh
    }));

    // Asumsikan harga per kWh = 1500
    const earnings = results.reduce((acc, r) => acc + (r.energy_kwh * 1500), 0);

    res.json({ kwh_history, earnings });
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Generator = require('../models/Generator');
const EnergyProduction = require('../models/EnergyProduction');

// Ambil data produksi energi user
router.get('/energy', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json([]);

  EnergyProduction.getByUser(userId, (err, data) => {
    if (err) return res.status(500).json([]);
    res.json(data);
  });
});

// Tambah generator
router.post('/generators', (req, res) => {
  const userId = req.session.user?.id;
  const { name, capacity } = req.body;
  if (!userId || !name || !capacity) return res.status(400).json({ message: 'Data tidak lengkap' });

  Generator.create(userId, name, capacity, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal tambah generator' });
    console.log(`⚡️ User ${userId} menambahkan generator: ${name} (${capacity} kW)`);
    res.json({ success: true });
  });
});

// (Opsional) Tambah data produksi energi manual
router.post('/energy', (req, res) => {
  const { generator_id, energy_kwh } = req.body;
  if (!generator_id || !energy_kwh) return res.status(400).json({ message: 'Data tidak lengkap' });

  EnergyProduction.log(generator_id, energy_kwh, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal catat produksi' });
    res.json({ success: true });
  });
});

// Ambil semua pembangkit energi dari seller
router.get('/energy/active-generators', (req, res) => {
  const query = `
    SELECT i.id, i.name, i.price, i.geo_link, i.energy_wh, u.email AS seller_email
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.type = 'energi'
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

module.exports = router;
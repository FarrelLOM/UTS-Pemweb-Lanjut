const express = require('express');
const router = express.Router();
const Payout = require('../models/Payout');

// Ajukan pencairan dana
router.post('/payout', (req, res) => {
  const userId = req.session.user?.id;
  const { amount, method } = req.body;
  if (!userId || !amount || !method) return res.status(400).json({ message: 'Data tidak lengkap' });

  Payout.request(userId, amount, method, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal ajukan payout' });
    console.log(`💸 User ${userId} ajukan payout Rp${amount} via ${method}`);
    res.json({ success: true });
  });
});

// Riwayat payout user
router.get('/payout', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json([]);

  Payout.getByUser(userId, (err, data) => {
    if (err) return res.status(500).json([]);
    res.json(data);
  });
});

module.exports = router;
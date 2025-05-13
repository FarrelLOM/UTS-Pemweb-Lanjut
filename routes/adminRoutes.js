const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Cek admin
function isAdmin(req, res, next) {
  if (req.session.user?.role === 'admin') next();
  else res.status(403).json({ message: 'Forbidden' });
}

// Ambil permintaan top-up
router.get('/admin/topups', isAdmin, (req, res) => {
  const query = `
    SELECT t.id, t.amount, u.email
    FROM topup_requests t
    JOIN users u ON t.user_id = u.id
    WHERE t.status = 'pending'
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

// Setujui top-up
router.post('/admin/topups/approve/:id', isAdmin, (req, res) => {
  const id = req.params.id;

  const query = `
    UPDATE users u
    JOIN topup_requests t ON u.id = t.user_id
    SET u.saldo = u.saldo + t.amount, t.status = 'approved'
    WHERE t.id = ?
  `;

  db.query(query, [id], err => {
    if (err) return res.status(500).json({ message: 'Gagal approve' });
    res.json({ success: true });
  });
});

// Ambil daftar energi yang dijual seller
router.get('/admin/energy-sales', isAdmin, (req, res) => {
  const query = `
    SELECT i.id, i.name, i.price, u.email AS seller_email
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.type = 'energi'
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

// Simulasi beli energi oleh admin
router.post('/admin/energy/buy/:id', isAdmin, (req, res) => {
  const itemId = req.params.id;

  const query = `
    UPDATE users u
    JOIN items i ON u.id = i.user_id
    SET u.saldo = u.saldo + i.price
    WHERE i.id = ?
  `;

  db.query(query, [itemId], err => {
    if (err) return res.status(500).json({ message: 'Gagal beli energi' });
    res.json({ success: true });
  });
});

module.exports = router;
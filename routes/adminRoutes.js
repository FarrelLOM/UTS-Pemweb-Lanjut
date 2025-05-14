const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// 🔌 Ambil penjualan energi aktif
router.get('/admin/energy-sales', (req, res) => {
  const query = `
    SELECT i.id, i.name, i.price, i.image, u.email AS seller_email
    FROM items i
    JOIN users u ON i.user_id = u.id
    WHERE i.type = 'energi'
    ORDER BY i.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Gagal ambil energi:', err);
      return res.status(500).json([]);
    }
    res.json(results);
  });
});

// 💳 Ambil permintaan top-up (pending)
router.get('/admin/topups', (req, res) => {
  const query = `
    SELECT t.id, t.amount, t.proof_image, u.email
    FROM topup_requests t
    JOIN users u ON t.user_id = u.id
    WHERE t.status = 'pending'
    ORDER BY t.requested_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Gagal ambil top-up:', err);
      return res.status(500).json([]);
    }
    res.json(results);
  });
});

// ✅ Setujui permintaan top-up (langsung tambah saldo)
router.post('/admin/topups/approve/:id', (req, res) => {
  const id = req.params.id;

  const query = `
    UPDATE users u
    JOIN topup_requests t ON u.id = t.user_id
    SET u.saldo = u.saldo + t.amount, t.status = 'approved'
    WHERE t.id = ?
  `;

  db.query(query, [id], err => {
    if (err) {
      console.error('❌ Gagal setujui topup:', err);
      return res.status(500).json({ message: 'Gagal approve topup' });
    }

    // Hapus data dari tabel topup_requests jika perlu
    db.query('DELETE FROM topup_requests WHERE id = ?', [id]);

    console.log(`✅ Top-up ID ${id} telah disetujui`);
    res.json({ success: true });
  });
});

// ⚡ Simulasi beli energi oleh admin (langsung tambah saldo ke seller)
router.post('/admin/energy/buy/:id', (req, res) => {
  const itemId = req.params.id;

  const query = `
    UPDATE users u
    JOIN items i ON u.id = i.user_id
    SET u.saldo = u.saldo + i.price
    WHERE i.id = ?
  `;

  db.query(query, [itemId], err => {
    if (err) {
      console.error('❌ Gagal beli energi:', err);
      return res.status(500).json({ message: 'Gagal beli energi' });
    }

    // Hapus item energi setelah dibeli
    db.query('DELETE FROM items WHERE id = ?', [itemId]);

    console.log(`✅ Energi ID ${itemId} berhasil dibeli oleh PLN`);
    res.json({ success: true });
  });
});

module.exports = router;
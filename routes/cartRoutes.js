const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// ✅ Ambil isi keranjang user
router.get('/cart', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json([]);

  const query = `
    SELECT c.id, i.name, i.price, i.image
    FROM cart c
    JOIN items i ON c.item_id = i.id
    WHERE c.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('❌ Gagal ambil keranjang:', err);
      return res.status(500).json([]);
    }
    res.json(results);
  });
});

// ✅ Tambah item ke keranjang
router.post('/cart', (req, res) => {
  const userId = req.session.user?.id;
  const { itemId } = req.body;
  if (!userId || !itemId) return res.status(400).json({ message: 'Data tidak lengkap' });

  const query = `INSERT INTO cart (user_id, item_id) VALUES (?, ?)`;
  db.query(query, [userId, itemId], (err) => {
    if (err) {
      console.error('❌ Gagal tambah ke keranjang:', err);
      return res.status(500).json({ message: 'Gagal tambah ke keranjang' });
    }
    console.log(`🛒 User #${userId} menambahkan item #${itemId} ke keranjang`);
    res.json({ success: true });
  });
});

// ✅ Hapus item dari keranjang
router.delete('/cart/:id', (req, res) => {
  const cartId = req.params.id;

  const query = `DELETE FROM cart WHERE id = ?`;
  db.query(query, [cartId], (err) => {
    if (err) {
      console.error('❌ Gagal hapus dari keranjang:', err);
      return res.status(500).json({ message: 'Gagal hapus' });
    }
    res.json({ success: true });
  });
});

module.exports = router;
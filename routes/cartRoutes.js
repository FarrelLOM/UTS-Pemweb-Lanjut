const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.get('/cart', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json([]);

  Cart.getByUser(userId, (err, items) => {
    if (err) return res.status(500).json([]);
    res.json(items);
  });
});

router.post('/cart', (req, res) => {
  const userId = req.session.user?.id;
  const { itemId } = req.body;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  Cart.add(userId, itemId, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal tambah ke keranjang' });
    console.log(`🛒 User ${userId} menambahkan item ${itemId} ke keranjang`);
    res.json({ success: true });
  });
});

router.delete('/cart/:id', (req, res) => {
  const cartId = req.params.id;
  Cart.delete(cartId, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal hapus dari keranjang' });
    res.json({ success: true });
  });
});

router.post('/checkout', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  Cart.clear(userId, (err) => {
    if (err) return res.status(500).json({ message: 'Gagal checkout' });
    console.log(`✅ Checkout oleh user ${userId}`);
    res.json({ success: true });
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();

// Dummy data produk (bisa diubah ke DB di masa depan)
const products = [
  { id: 1, name: 'Solar Panel 500W', price: 3000000 },
  { id: 2, name: 'Smart Meter Digital', price: 1250000 },
  { id: 3, name: 'Filter Air Rumah', price: 850000 },
  { id: 4, name: 'Inverter Hybrid', price: 2700000 }
];

router.get('/products', (req, res) => {
  res.json(products);
});

module.exports = router;
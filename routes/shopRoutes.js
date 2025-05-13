const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db/connection');
const fs = require('fs');

// Setup direktori upload
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Ambil semua item alat untuk shop list
router.get('/shop', (req, res) => {
  const query = `SELECT * FROM items WHERE type = 'alat' ORDER BY created_at DESC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

// Tambah item baru (alat/energi)
router.post('/add-item', upload.single('gambar'), (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const {
    name, price, description = '', jenis, jumlah = null,
    stok = null, lokasi = null
  } = req.body;

  const image = req.file ? '/uploads/' + req.file.filename : null;

  const sql = `
    INSERT INTO items (user_id, type, name, description, price, image, energy_wh, stock, geo_link, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [
    userId, jenis, name, description, price,
    image, jumlah || null, stok || null, lokasi || null
  ], (err) => {
    if (err) {
      console.error('❌ Gagal tambah item:', err);
      return res.status(500).json({ message: 'Gagal menambahkan produk' });
    }

    res.json({ success: true });
  });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const db = require('../db/connection');
const cloudinary = require('../utils/cloudinary');

// Upload sementara ke /temp sebelum Cloudinary
const upload = multer({ dest: 'temp/' });

// GET /shop → ambil semua produk "alat"
router.get('/shop', (req, res) => {
  const query = `SELECT * FROM items WHERE type = 'alat' ORDER BY created_at DESC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
});

// POST /add-item → tambah produk baru (alat atau energi)
router.post('/add-item', upload.single('gambar'), async (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const {
    name, price, description = '', jenis, jumlah = null,
    stok = null, lokasi = null
  } = req.body;

  let imageUrl = null;
  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'uploads'
      });
      imageUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Hapus file sementara
    }
  } catch (err) {
    console.error('❌ Gagal upload ke Cloudinary:', err);
    return res.status(500).json({ message: 'Gagal upload gambar' });
  }

  const sql = `
    INSERT INTO items (user_id, type, name, description, price, image, energy_wh, stock, geo_link, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [
    userId, jenis, name, description, price,
    imageUrl, jumlah || null, stok || null, lokasi || null
  ], (err) => {
    if (err) {
      console.error('❌ Gagal tambah item:', err);
      return res.status(500).json({ message: 'Gagal menambahkan produk' });
    }

    console.log(`📦 User #${userId} menjual ${jenis} - ${name}`);
    res.json({ success: true });
  });
});

module.exports = router;
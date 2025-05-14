const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const multer = require('multer');
const fs = require('fs');
const cloudinary = require('../utils/cloudinary');

const upload = multer({ dest: 'temp/' });

// Ambil saldo user
router.get('/saldo', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ saldo: 0 });

  db.query('SELECT saldo FROM users WHERE id = ?', [userId], (err, results) => {
    if (err || !results[0]) return res.status(500).json({ saldo: 0 });
    res.json({ saldo: results[0].saldo });
  });
});

// Ajukan topup saldo (disetujui admin nanti)
router.post('/topup', upload.single('bukti'), async (req, res) => {
  const userId = req.session.user?.id;
  const { amount } = req.body;

  if (!userId || !amount || !req.file) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  try {
    // Upload ke Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads'
    });
    const imageUrl = result.secure_url;
    fs.unlinkSync(req.file.path);

    // Simpan ke tabel topup_requests
    const sql = `
      INSERT INTO topup_requests (user_id, amount, proof_image, status, requested_at)
      VALUES (?, ?, ?, 'pending', NOW())
    `;

    db.query(sql, [userId, amount, imageUrl], err => {
      if (err) {
        console.error('❌ Gagal simpan topup:', err);
        return res.status(500).json({ message: 'Top-up gagal' });
      }

      console.log(`📨 Permintaan topup Rp${amount} dikirim oleh user ${userId}`);
      res.json({ success: true });
    });

  } catch (err) {
    console.error('❌ Upload Cloudinary gagal:', err);
    res.status(500).json({ message: 'Upload gagal' });
  }
});

module.exports = router;
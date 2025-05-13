const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const cloudinary = require('../utils/cloudinary');
const multer = require('multer');
const fs = require('fs');

// Gunakan multer dengan folder sementara
const upload = multer({ dest: 'temp/' });

// ✅ GET /account - ambil data akun user saat ini
router.get('/account', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({});

  const query = 'SELECT id, username, email, saldo, image FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('❌ Gagal ambil data user:', err);
      return res.status(500).json({});
    }
    res.json(results[0] || {});
  });
});

// ✅ POST /account/update - edit email, password, foto (via Cloudinary)
router.post('/account/update', upload.single('foto'), async (req, res) => {
  const userId = req.session.user?.id;
  const { email, password } = req.body;

  if (!userId || !email || !password) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  let imageUrl = null;

  try {
    // ✅ Upload ke Cloudinary jika ada file
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'uploads'
      });
      imageUrl = result.secure_url;

      // 🧹 Hapus file sementara
      fs.unlinkSync(req.file.path);
    }

    // ✅ Query update DB
    let query = 'UPDATE users SET email = ?, password = ?';
    const params = [email, password];

    if (imageUrl) {
      query += ', image = ?';
      params.push(imageUrl);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    db.query(query, params, err => {
      if (err) {
        console.error('❌ Gagal update akun:', err);
        return res.status(500).json({ success: false, message: 'Gagal update akun' });
      }

      console.log(`📤 Akun user #${userId} diperbarui (foto via Cloudinary)`);
      res.json({ success: true });
    });
  } catch (err) {
    console.error('❌ Upload atau update gagal:', err);
    res.status(500).json({ success: false, message: 'Gagal update akun' });
  }
});

module.exports = router;
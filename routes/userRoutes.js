const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const multer = require('multer');

// 📸 Konfigurasi upload foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  }
});
const upload = multer({ storage });

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

// ✅ POST /account/update - edit email, password, foto
router.post('/account/update', upload.single('foto'), (req, res) => {
  const userId = req.session.user?.id;
  const { email, password } = req.body;
  const foto = req.file?.filename;

  if (!userId || !email || !password) {
    return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
  }

  let query = 'UPDATE users SET email = ?, password = ?';
  const params = [email, password]; // ⬅️ password langsung disimpan (tanpa hash)

  if (foto) {
    query += ', image = ?';
    params.push(foto);
  }

  query += ' WHERE id = ?';
  params.push(userId);

  db.query(query, params, err => {
    if (err) {
      console.error('❌ Gagal update akun:', err);
      return res.status(500).json({ success: false, message: 'Gagal update akun' });
    }

    console.log(`✏️ Akun user #${userId} diperbarui`);
    res.json({ success: true });
  });
});

module.exports = router;
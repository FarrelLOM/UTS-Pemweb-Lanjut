const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Ambil saldo
router.get('/saldo', (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ saldo: 0 });

  db.query('SELECT saldo FROM users WHERE id = ?', [userId], (err, results) => {
    if (err || !results[0]) return res.status(500).json({ saldo: 0 });
    res.json({ saldo: results[0].saldo });
  });
});

// Top-up saldo (langsung menambahkan saldo user)
router.post('/topup', upload.single('bukti'), (req, res) => {
  const userId = req.session.user?.id;
  const { amount } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;

  if (!userId || !amount || !image) return res.status(400).json({ message: 'Data tidak lengkap' });

  db.query('UPDATE users SET saldo = saldo + ? WHERE id = ?', [amount, userId], (err) => {
    if (err) return res.status(500).json({ message: 'Top-up gagal' });

    console.log(`💰 Top-up Rp${amount} user ${userId}`);
    res.json({ success: true });
  });
});

module.exports = router;
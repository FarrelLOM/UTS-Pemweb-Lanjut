const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/connection');

// Setup upload foto laporan
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Kirim laporan
router.post('/report', upload.single('foto'), (req, res) => {
  const userId = req.session.user?.id;
  const { region, category, desc, title, geolink } = req.body;
  const image = req.file ? '/uploads/' + req.file.filename : null;

  if (!userId || !region || !category || !desc || !title || !geolink) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  const sql = `
    INSERT INTO reports (user_id, region, category, title, description, geo_link, image, reported_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [userId, region, category, title, desc, geolink, image], (err) => {
    if (err) return res.status(500).json({ message: 'Gagal simpan laporan' });

    // Tambahkan titik mikrogrid ke peta
    db.query(`
      INSERT INTO microgrids (user_id, name, lat, lon, description, created_at)
      VALUES (?, ?, 0, 0, ?, NOW())
    `, [userId, title, `Laporan: ${category} - ${region}`]); // dummy lat/lon

    console.log(`📝 Laporan ${title} berhasil dikirim oleh user ${userId}`);
    res.json({ success: true });
  });
});

module.exports = router;
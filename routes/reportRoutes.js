const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const db = require('../db/connection');
const cloudinary = require('../utils/cloudinary');

// 🗂️ Setup upload dengan multer (simpan sementara di folder /temp)
const upload = multer({ dest: 'temp/' });

// ✅ Route kirim laporan
router.post('/report', upload.single('foto'), async (req, res) => {
  const userId = req.session.user?.id;
  const { region, category, desc, title, geolink } = req.body;

  if (!userId || !region || !category || !desc || !title || !geolink) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  try {
    let imageUrl = null;

    // ✅ Upload ke Cloudinary jika ada file foto
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'uploads'
      });
      imageUrl = result.secure_url;

      // Hapus file sementara
      fs.unlinkSync(req.file.path);
    }

    const sql = `
      INSERT INTO reports (user_id, region, category, title, description, geo_link, image, reported_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(sql, [userId, region, category, title, desc, geolink, imageUrl], (err) => {
      if (err) {
        console.error('❌ Gagal simpan laporan:', err);
        return res.status(500).json({ message: 'Gagal simpan laporan' });
      }

      // Dummy titik peta (latitude/longitude akan diolah nanti)
      db.query(`
        INSERT INTO microgrids (user_id, name, lat, lon, description, created_at)
        VALUES (?, ?, 0, 0, ?, NOW())
      `, [userId, title, `Laporan: ${category} - ${region}`]);

      console.log(`📝 Laporan "${title}" berhasil dikirim oleh user ${userId}`);
      res.json({ success: true });
    });

  } catch (err) {
    console.error('❌ Gagal upload ke Cloudinary:', err);
    res.status(500).json({ message: 'Upload gagal' });
  }
});

module.exports = router;
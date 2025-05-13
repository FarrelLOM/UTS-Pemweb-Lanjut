const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Checkout proses
router.post('/checkout', (req, res) => {
  const userId = req.session.user?.id;
  const { metode, alamat } = req.body;

  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  // Ambil isi keranjang
  const getCartQuery = `
    SELECT c.item_id, i.price, i.stock, i.user_id AS seller_id
    FROM cart c
    JOIN items i ON c.item_id = i.id
    WHERE c.user_id = ?
  `;

  db.query(getCartQuery, [userId], (err, cart) => {
    if (err || !cart.length) return res.status(400).json({ success: false, message: 'Keranjang kosong atau gagal ambil data' });

    // Validasi stok
    const outOfStock = cart.find(item => item.stock <= 0);
    if (outOfStock) return res.status(400).json({ success: false, message: 'Stok habis untuk salah satu barang' });

    const totalHarga = cart.reduce((sum, item) => sum + item.price, 0);

    // Fungsi transaksi lanjutan
    const selesaikanTransaksi = () => {
      // Kurangi stok setiap item
      const updateStokQuery = `UPDATE items SET stock = stock - 1 WHERE id = ?`;

      // Tambahkan saldo ke seller
      const tambahSaldoQuery = `UPDATE users SET saldo = saldo + ? WHERE id = ?`;

      const prosesSemua = cart.map(item => {
        return new Promise((resolve, reject) => {
          db.query(updateStokQuery, [item.item_id], err => {
            if (err) return reject(err);
            db.query(tambahSaldoQuery, [item.price, item.seller_id], err => {
              if (err) return reject(err);
              resolve();
            });
          });
        });
      });

      Promise.all(prosesSemua).then(() => {
        db.query(`DELETE FROM cart WHERE user_id = ?`, [userId]);
        res.json({ success: true });
      }).catch(() => {
        res.status(500).json({ success: false, message: 'Gagal menyelesaikan transaksi' });
      });
    };

    // Jika metode dompet digital
    if (metode === 'dompet') {
      db.query(`SELECT saldo FROM users WHERE id = ?`, [userId], (err, rows) => {
        if (err || rows[0].saldo < totalHarga) {
          return res.status(400).json({ success: false, message: 'Saldo tidak cukup' });
        }

        // Kurangi saldo pembeli
        db.query(`UPDATE users SET saldo = saldo - ? WHERE id = ?`, [totalHarga, userId], err => {
          if (err) return res.status(500).json({ success: false });
          selesaikanTransaksi();
        });
      });
    } else {
      // Transfer manual, lanjutkan tanpa saldo
      selesaikanTransaksi();
    }
  });
});

module.exports = router;
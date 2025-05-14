const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// ✅ Checkout dan proses transaksi
router.post('/checkout', (req, res) => {
  const userId = req.session.user?.id;
  const { metode, alamat } = req.body;

  if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

  const getCartQuery = `
    SELECT c.item_id, i.price, i.stock, i.user_id AS seller_id
    FROM cart c
    JOIN items i ON c.item_id = i.id
    WHERE c.user_id = ?
  `;

  db.query(getCartQuery, [userId], (err, cart) => {
    if (err || !cart.length) return res.status(400).json({ success: false, message: 'Keranjang kosong' });

    // ✅ Validasi stok
    const outOfStock = cart.find(item => item.stock <= 0);
    if (outOfStock) return res.status(400).json({ success: false, message: 'Stok habis!' });

    const totalHarga = cart.reduce((sum, item) => sum + item.price, 0);

    // ✅ Jalankan semua proses transaksi
    const selesaikanTransaksi = () => {
      const updateStok = `UPDATE items SET stock = stock - 1 WHERE id = ?`;
      const tambahSaldo = `UPDATE users SET saldo = saldo + ? WHERE id = ?`;

      const semuaTransaksi = cart.map(item => {
        return new Promise((resolve, reject) => {
          db.query(updateStok, [item.item_id], err1 => {
            if (err1) return reject(err1);
            db.query(tambahSaldo, [item.price, item.seller_id], err2 => {
              if (err2) return reject(err2);
              resolve();
            });
          });
        });
      });

      Promise.all(semuaTransaksi).then(() => {
        db.query(`DELETE FROM cart WHERE user_id = ?`, [userId]);
        console.log(`✅ Checkout selesai oleh user #${userId}`);
        res.json({ success: true });
      }).catch(err => {
        console.error('❌ Gagal proses transaksi:', err);
        res.status(500).json({ success: false });
      });
    };

    // ✅ Jika metode dompet digital
    if (metode === 'dompet') {
      db.query(`SELECT saldo FROM users WHERE id = ?`, [userId], (err, rows) => {
        if (err || rows[0].saldo < totalHarga) {
          return res.status(400).json({ success: false, message: 'Saldo tidak cukup' });
        }

        db.query(`UPDATE users SET saldo = saldo - ? WHERE id = ?`, [totalHarga, userId], err => {
          if (err) return res.status(500).json({ success: false, message: 'Gagal kurangi saldo' });
          selesaikanTransaksi();
        });
      });
    } else {
      // ✅ Metode transfer → lanjut tanpa potong saldo
      selesaikanTransaksi();
    }
  });
});

module.exports = router;
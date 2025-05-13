const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'ztoz1.h.filess.io',
  user: 'PLNEnergy_splitfully',
  password: '91a7ca77deef8b1a3823015e2dd9e840f0aefb56',             // ubah jika ada password MySQL Anda
  database: 'PLNEnergy_splitfully',    // pastikan sesuai dengan nama database Anda
  port : "61001"
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal koneksi ke database:', err);
  } else {
    console.log('✅ Terhubung ke MySQL (pln_energy)');
  }
});

module.exports = db;
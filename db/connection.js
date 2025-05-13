const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',             // ubah jika ada password MySQL Anda
  database: 'pln_energy'    // pastikan sesuai dengan nama database Anda
});

db.connect((err) => {
  if (err) {
    console.error('❌ Gagal koneksi ke database:', err);
  } else {
    console.log('✅ Terhubung ke MySQL (pln_energy)');
  }
});

module.exports = db;
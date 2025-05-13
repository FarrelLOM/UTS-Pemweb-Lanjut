const db = require('../db/connection');

const User = {
  create: (username, email, password, callback) => {
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], callback);
  },

  findByCredentials: (email, password, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  },

  findById: (id, callback) => {
    db.query('SELECT username, email FROM users WHERE id = ?', [id], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }
};

module.exports = User;
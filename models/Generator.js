const db = require('../db/connection');

const Generator = {
  create: (userId, name, capacity, callback) => {
    const sql = 'INSERT INTO generators (user_id, name, capacity) VALUES (?, ?, ?)';
    db.query(sql, [userId, name, capacity], callback);
  },

  getByUser: (userId, callback) => {
    const sql = 'SELECT * FROM generators WHERE user_id = ? ORDER BY created_at DESC';
    db.query(sql, [userId], callback);
  }
};

module.exports = Generator;
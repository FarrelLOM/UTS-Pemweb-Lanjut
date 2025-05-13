const db = require('../db/connection');

const Item = {
  getAll: (callback) => {
    db.query('SELECT * FROM items ORDER BY created_at DESC', callback);
  },

  add: (userId, name, description, price, callback) => {
    const sql = 'INSERT INTO items (user_id, name, description, price) VALUES (?, ?, ?, ?)';
    db.query(sql, [userId, name, description, price], callback);
  }
};

module.exports = Item;
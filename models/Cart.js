const db = require('../db/connection');

const Cart = {
  getByUser: (userId, callback) => {
    const sql = `
      SELECT c.id, i.name, i.price
      FROM cart c
      JOIN items i ON c.item_id = i.id
      WHERE c.user_id = ?
    `;
    db.query(sql, [userId], callback);
  },

  add: (userId, itemId, callback) => {
    const sql = 'INSERT INTO cart (user_id, item_id) VALUES (?, ?)';
    db.query(sql, [userId, itemId], callback);
  },

  delete: (cartId, callback) => {
    db.query('DELETE FROM cart WHERE id = ?', [cartId], callback);
  },

  clear: (userId, callback) => {
    db.query('DELETE FROM cart WHERE user_id = ?', [userId], callback);
  }
};

module.exports = Cart;
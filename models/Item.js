const db = require('../db/connection');

const Item = {
  getAll: (callback) => {
    db.query('SELECT * FROM items ORDER BY created_at DESC', callback);
  },

  getByType: (type, callback) => {
    db.query('SELECT * FROM items WHERE type = ? ORDER BY created_at DESC', [type], callback);
  },

  add: (data, callback) => {
    const sql = `
      INSERT INTO items (user_id, type, name, description, price, image, energy_wh, stock, geo_link, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    db.query(sql, [
      data.user_id,
      data.type,
      data.name,
      data.description,
      data.price,
      data.image,
      data.energy_wh || null,
      data.stock || null,
      data.geo_link || null
    ], callback);
  }
};

module.exports = Item;
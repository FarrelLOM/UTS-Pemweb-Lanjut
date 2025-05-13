const db = require('../db/connection');

const Payout = {
  request: (userId, amount, method, callback) => {
    const sql = 'INSERT INTO payouts (user_id, amount, method, status, requested_at) VALUES (?, ?, ?, "pending", NOW())';
    db.query(sql, [userId, amount, method], callback);
  },

  getByUser: (userId, callback) => {
    const sql = 'SELECT amount, method, status, requested_at FROM payouts WHERE user_id = ? ORDER BY requested_at DESC';
    db.query(sql, [userId], callback);
  }
};

module.exports = Payout;
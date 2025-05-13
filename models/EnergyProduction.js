const db = require('../db/connection');

const EnergyProduction = {
  log: (generatorId, energy_kwh, callback) => {
    const sql = 'INSERT INTO energy_production (generator_id, energy_kwh, timestamp) VALUES (?, ?, NOW())';
    db.query(sql, [generatorId, energy_kwh], callback);
  },

  getByUser: (userId, callback) => {
    const sql = `
      SELECT e.energy_kwh, e.timestamp
      FROM energy_production e
      JOIN generators g ON e.generator_id = g.id
      WHERE g.user_id = ?
      ORDER BY e.timestamp ASC
    `;
    db.query(sql, [userId], callback);
  }
};

module.exports = EnergyProduction;
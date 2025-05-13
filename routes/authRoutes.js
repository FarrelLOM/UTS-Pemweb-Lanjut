const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  User.create(username, email, password, (err) => {
    if (err) return res.status(500).json({ message: 'Registrasi gagal' });
    console.log(`✅ Registrasi: ${email}`);
    res.json({ success: true });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findByCredentials(email, password, (err, user) => {
    if (err || !user) return res.status(401).json({ message: 'Login gagal' });
    req.session.user = user;
    console.log(`✅ Login: ${email}`);
    res.json({ success: true });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logout berhasil' });
});

module.exports = router;
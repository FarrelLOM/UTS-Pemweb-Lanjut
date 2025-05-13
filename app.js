const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const app = express();

// Middleware parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware session
app.use(session({
  secret: 'pln-energy-marketplace-secret',
  resave: false,
  saveUninitialized: true
}));

// Logging request
app.use((req, res, next) => {
  const user = req.session.user?.email || 'Anonim';
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} (${user})`;
  console.log(log);

  const logPath = path.join(__dirname, '.logs', 'activity.log');
  fs.mkdirSync(path.dirname(logPath), { recursive: true });
  fs.appendFile(logPath, log + '\n', err => {
    if (err) console.error('Gagal menulis log:', err);
  });

  next();
});

// Public folder (static files)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./routes/authRoutes'));
app.use(require('./routes/userRoutes'));
app.use(require('./routes/shopRoutes'));
app.use(require('./routes/cartRoutes'));
app.use(require('./routes/topupRoutes'));
app.use(require('./routes/payoutRoutes'));
app.use(require('./routes/reportRoutes'));
app.use(require('./routes/checkoutRoutes'));
app.use(require('./routes/mikrogridRoutes'));
app.use(require('./routes/dashboardRoutes'));
app.use(require('./routes/energyRoutes'));
app.use(require('./routes/adminRoutes'));
app.use(require('./routes/newsRoutes'));

// Halaman default & 404
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 - Halaman tidak ditemukan');
});

// Jalankan server
const PORT = process.env.PORT || 61001;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port:${PORT}`);
});
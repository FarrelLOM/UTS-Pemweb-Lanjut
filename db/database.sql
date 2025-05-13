CREATE DATABASE IF NOT EXISTS pln_energy;
USE pln_energy;

-- USERS
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ITEMS (Energi yang dijual user)
CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  description TEXT,
  price DECIMAL(12,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- CART
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  item_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

-- GENERATOR
CREATE TABLE generators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  capacity DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- PRODUKSI ENERGI
CREATE TABLE energy_production (
  id INT AUTO_INCREMENT PRIMARY KEY,
  generator_id INT,
  energy_kwh DECIMAL(10,2),
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (generator_id) REFERENCES generators(id) ON DELETE CASCADE
);

-- PAYOUT
CREATE TABLE payouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  amount DECIMAL(12,2),
  method VARCHAR(50),
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- LAPORAN ENERGI/SANITASI
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  region VARCHAR(100),
  category ENUM('energi','sanitasi'),
  description TEXT,
  reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE microgrids (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  name VARCHAR(100),
  lat DECIMAL(10, 6),
  lon DECIMAL(10, 6),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE microgrid_generators (
  id INT AUTO_INCREMENT PRIMARY KEY,
  microgrid_id INT,
  generator_id INT,
  FOREIGN KEY (microgrid_id) REFERENCES microgrids(id) ON DELETE CASCADE,
  FOREIGN KEY (generator_id) REFERENCES generators(id) ON DELETE CASCADE
);

ALTER TABLE reports 
ADD COLUMN title VARCHAR(100),
ADD COLUMN image VARCHAR(255),
ADD COLUMN geo_link TEXT;

ALTER TABLE users ADD saldo DECIMAL(12,2) DEFAULT 0;

ALTER TABLE items
ADD column type VARCHAR(10), -- 'energi' atau 'alat'
ADD COLUMN image VARCHAR(255),
ADD COLUMN energy_wh INT,
ADD COLUMN geo_link TEXT,
ADD COLUMN stock INT;
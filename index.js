// index.js

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './db.js'; // Sesuaikan dengan lokasi file db.js Anda
import authRoutes from './routes/authRoutes.js'; // Sesuaikan dengan lokasi file authRoutes.js Anda
import dashboardRoutes from './routes/dashboardRoutes.js'; // Sesuaikan dengan lokasi file dashboardRoutes.js Anda

dotenv.config();

const app = express();

app.use(bodyParser.json());

// Setup koneksi database
db.authenticate()
  .then(() => {
    console.log('Database sudah terhuung...');
    return db.sync({ alter: true }); // Sinkronisasi model dengan struktur tabel
  })
  .catch((err) => {
    console.error('gagal connect ke database:', err);
  });

// Route untuk auth
app.use('/api/auth', authRoutes);

// Route untuk dashboard
app.use('/api/dashboard', dashboardRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import db from './db.js';
import authRoutes from './routes/authRoutes.js';
import beritaRoutes from './routes/beritaRoutes.js';

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(process.cwd(), 'public')));

db.authenticate()
  .then(() => {
    console.log('Database connected...');
    return db.sync({ alter: true });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

app.use('/api/auth', authRoutes);
app.use('/api', beritaRoutes);
app.use('/api/berita', beritaRoutes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
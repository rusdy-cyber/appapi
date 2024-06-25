// routes/beritaRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import Berita from '../models/Berita.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// Mengatur storage engine untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/berita', verifyToken, upload.single('gambar'), async (req, res) => {
  try {
    const { title, paragraf } = req.body;
    const { id: adminId } = req.user;
    const gambar = req.file.filename;

    const berita = await Berita.create({ gambar, title, paragraf, adminId });
    res.json(berita);
  } catch (err) {
    console.error('Error creating berita:', err.message);
    res.status(500).send('Server error');
  }
});

// routes/beritaRoutes.js

router.get('/berita', async (req, res) => {
    try {
      const { adminId } = req.query; // Ambil adminId dari query string
  
      // Tambahkan kondisi where untuk filter berdasarkan adminId
      const beritaList = await Berita.findAll({
        where: { adminId },
      });
  
      // Ubah URL gambar menjadi URL lengkap dengan protokol dan host
      const updatedBeritaList = beritaList.map((berita) => {
        const fullImageUrl = `${req.protocol}://${req.get('host')}/uploads/${berita.gambar}`;
        return { ...berita.dataValues, gambar: fullImageUrl };
      });
  
      res.json(updatedBeritaList);
    } catch (err) {
      console.error('Error fetching berita:', err.message);
      res.status(500).send('Server error');
    }
  });

  // DELETE berita by ID
 // DELETE berita by ID
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params; // Ambil ID berita dari parameter URL
    const { id: adminId } = req.user; // Ambil adminId dari token yang sudah diverifikasi
  
    try {
      // Cari berita berdasarkan id dan adminId
      const berita = await Berita.findOne({
        where: {
          id,
          adminId,
        },
      });
  
      if (!berita) {
        return res.status(404).json({ msg: 'Berita not found' });
      }
  
      await berita.destroy(); // Hapus berita dari database
  
      res.json({ msg: 'Berita deleted successfully' });
    } catch (err) {
      console.error('Error deleting berita:', err.message);
      res.status(500).send('Server error');
    }
  });
  

export default router;

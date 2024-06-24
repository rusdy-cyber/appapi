// routes/authRoutes.js
import express from 'express';
import { register, login } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.post('/logout', verifyToken, (req, res) => {
    // Tidak ada yang perlu dilakukan di sisi server untuk logout dengan JWT
    // Klien hanya perlu menghapus token dari penyimpanan mereka
    res.json({ msg: 'Logged out successfully' });
    });

export default router;

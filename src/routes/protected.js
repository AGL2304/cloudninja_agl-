import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

// Accessible uniquement aux admins
router.get('/', auth('admin'), (req, res) => {
  res.json({
    message: 'Bienvenue dans la zone protégée pour admins 🔐',
    user: req.user
  });
});

export default router;

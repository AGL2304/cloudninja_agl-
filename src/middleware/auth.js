import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'defaultSecretKey';

export default function auth(requiredRole) {
  return function (req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token manquant' });

    try {
      const decoded = jwt.verify(token, secret);
      req.user = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ error: 'Accès refusé : rôle insuffisant' });
      }

      next();
    } catch (err) {
      res.status(403).json({ error: 'Token invalide' });
    }
  };
}

import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const services = [
  { id: 1, name: 'Cloud Storage' },
  { id: 2, name: 'CI/CD Pipeline' },
  { id: 3, name: 'Monitoring & Logging' },
];

router.get('/', (req, res) => {
  res.json(services);
});

router.post('/',
  body('name').isString().notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name } = req.body;
    const newService = {
      id: services.length + 1,
      name,
    };
    services.push(newService);

    res.status(201).json(newService);
});

export default router;

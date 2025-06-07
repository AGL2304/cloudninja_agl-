const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const services = [
  { id: 1, name: 'Cloud Storage' },
  { id: 2, name: 'CI/CD Pipeline' },
  { id: 3, name: 'Monitoring & Logging' },
];

router.get('/', (req, res) => {
  res.json(services);
});

module.exports = router;

router.post('/',
  body('name').isString().notEmpty(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Ajouter à la liste fictive ici
    res.status(201).json({ message: 'Service ajouté' });
});

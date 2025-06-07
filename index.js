const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Déduction de __dirname compatible CommonJS
const __dirname = __dirname; // Pas besoin de fileURLToPath en CommonJS

app.use(express.json()); // Pour parser le JSON du corps des requêtes

// Route GET logs existants
app.get('/api/logs', (req, res) => {
  const logFilePath = path.join(__dirname, 'logs', 'app.log');

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Impossible de lire le fichier de logs.' });
    }

    const lines = data.trim().split('\n');
    const last10Lines = lines.slice(-10);

    res.json({ logs: last10Lines });
  });
});

// Route POST pour ajouter un log
app.post('/api/logs', (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Le message est requis et doit être une chaîne de caractères.' });
  }

  const logFilePath = path.join(__dirname, 'logs', 'app.log');
  const logEntry = `[${new Date().toISOString()}] ${message}\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Impossible d\'écrire dans le fichier de logs.' });
    }

    res.status(201).json({ message: 'Log ajouté avec succès.' });
  });
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

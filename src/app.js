const express = require('express');
const logger = require('./middleware/logger');
const servicesRoute = require('./routes/services');
const statusRoute = require('./routes/status');

const app = express();

app.use(express.json());
app.use(logger);
app.use(express.static('public'));

app.use('/api/services', servicesRoute);
app.use('/api/status', statusRoute);

module.exports = app; // Exporter l'app sans démarrer le serveur

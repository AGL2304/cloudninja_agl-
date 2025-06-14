import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import helmet from 'helmet';
import client from 'prom-client';           // <-- import Prometheus client
import logger from './middleware/logger.js';
import servicesRoute from './routes/services.js';
import statusRoute from './routes/status.js';
import auth from './middleware/auth.js';
import protectedRoute from './routes/protected.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());
app.use(express.json());
app.use(logger);
app.use(express.static('public'));

// Création d'un registre Prometheus (par défaut)
const register = client.register;

// Création de métriques personnalisées
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Durée des requêtes HTTP en millisecondes',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 400, 500, 1000],
});

// Middleware pour mesurer les requêtes
app.use((req, res, next) => {
  const end = httpRequestDurationMs.startTimer();
  res.on('finish', () => {
    httpRequestCounter.inc({
      method: req.method,
      route: req.route ? req.route.path : req.path,
      status_code: res.statusCode,
    });
    end({ method: req.method, route: req.route ? req.route.path : req.path, status_code: res.statusCode });
  });
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/services', servicesRoute);
app.use('/api/status', statusRoute);
app.use('/api/protected', protectedRoute);

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

// Route /metrics pour Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

export default app;

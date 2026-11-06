const path = require('path');
const fs = require('fs');
const http = require('http');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');

const connectDB = require('./config/db');
const realtime = require('./realtime');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'crowdfix-api' }));

// Make sure the database is connected before any API call (needed for serverless hosts too).
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use(
  '/api/auth',
  rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: true, legacyHeaders: false })
);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/solutions', require('./routes/solutions'));
app.use('/api', require('./routes/community'));

// Serve the built frontend when it exists (single-service deploys such as Render).
const clientBuild = path.join(__dirname, '..', 'frontend', 'build');
if (fs.existsSync(path.join(clientBuild, 'index.html'))) {
  app.use(express.static(clientBuild, { maxAge: '1h', index: false }));
  app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(clientBuild, 'index.html')));
} else {
  app.get('/', (req, res) => res.json({ message: 'CrowdFix API is running' }));
}

app.use('/api', notFound);
app.use(errorHandler);

if (require.main === module) {
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });
  realtime.attach(io);

  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => server.listen(PORT, () => console.log(`CrowdFix API listening on ${PORT}`)))
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = app;

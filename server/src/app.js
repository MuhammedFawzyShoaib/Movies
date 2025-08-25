require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { connect } = require('./db');
const movieRoutes = require('./routes/movies.routes');

const PORT = process.env.PORT || 5000;
const ORIGINS = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);

async function bootstrap() {
  await connect(process.env.MONGO_URI);
  const app = express();

  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors({ origin: (origin, cb) => {
    if (!origin || ORIGINS.length === 0 || ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  }}));

  app.get('/api/health', (req, res) => res.json({ ok: true }));
  app.use('/api', movieRoutes);

  app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
}

bootstrap();

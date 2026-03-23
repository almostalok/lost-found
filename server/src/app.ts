import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import routes from './routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// ─── Global Middleware ──────────────────────────────────
app.use(helmet());
app.use(cors({ origin: config.cors.clientUrl, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ─────────────────────────────────────────
app.use('/api/v1', routes);

// ─── Error Handling ─────────────────────────────────────
app.use(errorMiddleware);

export default app;

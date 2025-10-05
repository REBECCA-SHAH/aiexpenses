import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import openapi from '../openapi.json' with { type: 'json' };

import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';
import aiRoutes from './routes/ai.js';

const app = express();

app.use(helmet());

// ✅ Fixed CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://aiexpenses.netlify.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get('/', (req, res) => {
  return res.redirect('/api/docs');
});

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ai', aiRoutes);

export default app;

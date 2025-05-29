import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import salaryRoutes from './api/v1/routes/salaryRoutes';
import db from './config/db';
import swaggerUi from 'swagger-ui-express';
import { getSwaggerSpec } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(getSwaggerSpec));

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// app.get('/', (req, res) => {
//   res.json({ message: 'Hello from default API!' });
// });

app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Routes
app.use('/api/v1/salary', salaryRoutes);

// Basic 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

async function startServer() {
  try {
    // await setupSwaggerDocs();

    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
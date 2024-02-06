import http from 'http';
import path from 'path';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose'; // Import Mongoose
import { logger } from './src/services/logger.service';
import { config } from './src/config';

  import { authRoutes } from './src/api/auth/auth.routes';
  import { userRoutes } from './src/api/user/user.routes';
  import { petRoutes } from './src/api/pet/pet.routes';


const app = express();

// Connect to MongoDB
mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
  .then(() => {
    logger.info('Connected to MongoDB');
    startServer(); // Call startServer here
  })
  .catch((err) => {
    logger.error('Unable to connect to MongoDb', err);
    logger.error('Shutting down server');
  });

// Define startServer function
function startServer() {
  // Express App Config
  const corsOptions = {
    origin: [
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
      'http://localhost:5173',
      'http://127.0.0.1:5174',
      'http://localhost:5174',
      'http://127.0.0.1:5176',
      'http://localhost:5176',
    ],
    credentials: true
  };
  app.use(cors(corsOptions));
  app.use(express.static('public'));
  app.use(cookieParser());
  app.use(express.json());


  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/pet', petRoutes);

  app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
  });

  const port = process.env.PORT || 3030;
  app.listen(port, () => {
    logger.info(`Server listening on port http://127.0.0.1:${port}/`);
  });
}

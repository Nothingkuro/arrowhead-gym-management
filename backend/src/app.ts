import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import paymentRoutes from './routes/payment.routes';
import authRoutes from './routes/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', paymentRoutes);


export default app;

// Lemuel was here * commit #1

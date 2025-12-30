import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

import userRoutes from './routes/user.route.js';
import companyRoutes from './routes/seller.route.js';
import productRoutes from './routes/product.route.js';
import dashboardRoutes from './routes/dashboard.route.js';
import inquiryRoutes from './routes/inquiry.route.js';
import geminiRoutes from './routes/gemini.route.js';

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --------- GLOBAL MIDDLEWARES ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: 'https://b2b-b.netlify.app',
    credentials: true,
  })
);
// --------- HEALTH CHECK ----------
app.get('/', (req, res) => {
  res.send('🚀 B2B IndiaMART Clone API is running');
});

// --------- API ROUTES ----------
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/company', companyRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/seller/dashboard', dashboardRoutes);
app.use('/api/v1/inquiries', inquiryRoutes);
app.use("/api/v1/gemini", geminiRoutes);


// --------- DATABASE CONNECTION ----------
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');

    // --------- START SERVER ----------
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

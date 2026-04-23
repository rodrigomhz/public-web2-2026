// src/app.js
import express from 'express';
import prisma from './config/prisma.js';
import usersRoutes from './routes/users.routes.js';
import pdfRoutes from './routes/pdf.routes.js';
// import cors from 'cors'; // Opcional, instalar con: npm install cors

const app = express();
app.use(express.json());
// app.use(cors()); // Descomentar si usas Live Server

app.use(express.static('src')); // Sirve el index.html en localhost:3000/index.html

// Rutas
app.use('/api/users', usersRoutes);
app.use('/api/pdf', pdfRoutes);

// Health check
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', database: 'disconnected' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});

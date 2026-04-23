// src/routes/pdf.routes.js
import { Router } from 'express';
import * as pdfController from '../controllers/pdf.controller.js';

const router = Router();

// GET /api/pdf - Devuelve un PDF simple
router.get('/', pdfController.sendSimplePDF);

export default router;

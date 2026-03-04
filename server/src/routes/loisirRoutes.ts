import { Router } from 'express';
import {
  getAllLoisirs,
  getLoisirById,
  createLoisir,
  updateLoisir,
  deleteLoisir
} from '../controllers/loisirController';
import { validateLoisir } from '../middleware/validation';
import { uploadLoisir } from '../middleware/upload';

const router = Router();

// Routes publiques
router.get('/', getAllLoisirs);
router.get('/:id', getLoisirById);

// Routes admin (upload optionnel : JSON ou multipart/form-data)
router.post('/', uploadLoisir, validateLoisir, createLoisir);
router.put('/:id', uploadLoisir, validateLoisir, updateLoisir);
router.delete('/:id', deleteLoisir);

export default router; 
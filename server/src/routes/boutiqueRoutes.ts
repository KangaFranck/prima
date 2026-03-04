import { Router } from 'express';
import {
  getAllBoutiques,
  getBoutiqueById,
  createBoutique,
  updateBoutique,
  deleteBoutique
} from '../controllers/boutiqueController';
import { validateBoutique } from '../middleware/validation';
import { uploadBoutique } from '../middleware/upload';

const router = Router();

// Routes publiques
router.get('/', getAllBoutiques);
router.get('/:id', getBoutiqueById);

// Routes admin (upload optionnel : JSON ou multipart/form-data)
router.post('/', uploadBoutique, validateBoutique, createBoutique);
router.put('/:id', uploadBoutique, validateBoutique, updateBoutique);
router.delete('/:id', deleteBoutique);

export default router; 
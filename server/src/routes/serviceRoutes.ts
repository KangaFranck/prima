import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} from '../controllers/serviceController';
import { validateService } from '../middleware/validation';
import { uploadService } from '../middleware/upload';

const router = Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', uploadService, validateService, createService);
router.put('/:id', uploadService, validateService, updateService);
router.delete('/:id', deleteService);

export default router;

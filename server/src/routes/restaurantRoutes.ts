import { Router } from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
} from '../controllers/restaurantController';
import { validateRestaurant } from '../middleware/validation';
import { uploadRestaurant } from '../middleware/upload';

const router = Router();

// Routes publiques
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Routes admin (upload optionnel : JSON ou multipart/form-data)
router.post('/', uploadRestaurant, validateRestaurant, createRestaurant);
router.put('/:id', uploadRestaurant, validateRestaurant, updateRestaurant);
router.delete('/:id', deleteRestaurant);

export default router; 
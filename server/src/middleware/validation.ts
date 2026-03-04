import { Request, Response, NextFunction } from 'express';

export const validateRestaurant = (req: Request, res: Response, next: NextFunction): void => {
  const { nom } = req.body;
  
  if (!nom) {
    res.status(400).json({ message: 'Le nom est requis' });
    return;
  }

  next();
};

export const validateBoutique = (req: Request, res: Response, next: NextFunction): void => {
  const { nom } = req.body;
  
  if (!nom) {
    res.status(400).json({ message: 'Le nom est requis' });
    return;
  }

  next();
};

export const validateLoisir = (req: Request, res: Response, next: NextFunction): void => {
  const { nom } = req.body;
  
  if (!nom) {
    res.status(400).json({ message: 'Le nom est requis' });
    return;
  }

  next();
}; 
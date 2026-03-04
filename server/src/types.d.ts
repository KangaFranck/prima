import { Request } from 'express';
import { File } from 'multer';

declare module 'express' {
  interface Request {
    file?: File;
    files?: File[];
  }
}

declare module 'cors';
declare module 'multer';

declare namespace Express {
  interface Request {
    file?: any;
    files?: any[];
  }
} 
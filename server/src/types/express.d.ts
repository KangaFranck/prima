import { Request as ExpressRequest, Response as ExpressResponse, NextFunction as ExpressNextFunction } from 'express';

declare global {
  namespace Express {
    interface Request extends ExpressRequest {
      params: {
        id?: string;
        [key: string]: string | undefined;
      };
      query: {
        includeInactive?: string;
        [key: string]: string | undefined;
      };
      body: any;
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
    }

    interface Response extends ExpressResponse {
      status(code: number): this;
      json(body: any): this;
      send(body: any): this;
    }

    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

declare module 'express' {
  interface Request {
    params: {
      id?: string;
      [key: string]: string | undefined;
    };
    query: {
      includeInactive?: string;
      [key: string]: string | undefined;
    };
    body: any;
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }

  interface Response {
    status(code: number): this;
    json(body: any): this;
    send(body: any): this;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    params: {
      id?: string;
      [key: string]: string | undefined;
    };
    query: {
      includeInactive?: string;
      [key: string]: string | undefined;
    };
    body: any;
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }

  interface Response {
    status(code: number): this;
    json(body: any): this;
    send(body: any): this;
  }
}

export type Request = Express.Request;
export type Response = Express.Response;
export type NextFunction = ExpressNextFunction; 
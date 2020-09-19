import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';

import { notFound, errorHandler } from './middlewares';

import packageJson from '../package.json';
const { version, name } = packageJson;

class Server {

  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
    this.middlewares();
  }

  private config() {

    const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
    this.app.use(express.urlencoded({ extended: false }));
    this.app.use(express.json({ limit: '5mb' }));
    this.app.use(cookieParser());
    this.app.use(morgan('common', { stream: accessLogStream }));
    this.app.use(compression());
    this.app.use(helmet());
    this.app.use(cors());

    this.app.use((_, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials x-access-token'
      );
      res.header('Access-Control-Allow-Credentials', 'true');
      next();
    });
  }

  private routes() {
    this.app.get('/', (_req, res) => res.json({ version, name }));
  }

  private middlewares() {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

}

export default new Server().app;

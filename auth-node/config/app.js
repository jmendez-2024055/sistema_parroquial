'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import 'dotenv/config';

import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from './rate.limit.configuration.js';
import { errorHandler } from './middlewares/error.middleware.js';

import eventoRoutes from '../src/event/event.routes.js';
import avisosRoutes from '../src/notice/notice.routes.js'; 
import massScheduleRoutes from '../src/massShedule/massSchedule.routes.js';
import categoriaRoutes from '../src/category/category.routes.js';

const BASE_PATH = '/SistemaParroquial/v1';

const routes = (app) => {
    app.use(`${BASE_PATH}/eventos`, eventoRoutes);
    app.use(`${BASE_PATH}/avisos`, avisosRoutes);
    app.use(`${BASE_PATH}/misa`, massScheduleRoutes);
    app.use(`${BASE_PATH}/categorias`, categoriaRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            success: true,
            message: 'Servicio funcionando correctamente',
            timeStamp: new Date().toISOString()
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'EndPoint no encontrado'
        });
    });
};

const middlewares = (app) => {
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));

    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(compression()); 
    app.use(requestLimit);
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 3000;

    app.set('trust proxy', 1);

    try {
        middlewares(app);

        await dbConnection();

        routes(app);

        app.use(errorHandler);

        app.listen(PORT, () => {
            console.log(` Sistema Parroquial corriendo en puerto ${PORT}`);
            console.log(` Health check: http://localhost:${PORT}${BASE_PATH}/health`);
        });

    } catch (err) {
        console.error('Error al iniciar el servidor:', err);
        process.exit(1);
    }
};
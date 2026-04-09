import { JsonServerApp } from './types';
import { getVideosController, refreshVideosController } from './videos.controller';

export const registerVideoRoutes = (app: JsonServerApp) => {
    app.get('/api/videos/rutube', getVideosController);
    app.get('/videos/rutube', getVideosController);
    app.post('/api/videos/rutube/refresh', refreshVideosController);
    app.post('/videos/rutube/refresh', refreshVideosController);
};

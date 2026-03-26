import { JsonServerApp } from './types';
import { getVideosController } from './videos.controller';

export const registerVideoRoutes = (app: JsonServerApp) => {
    app.get('/api/videos/rutube', getVideosController);
    app.get('/videos/rutube', getVideosController);
};

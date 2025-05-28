import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Logging middleware should come before route handlers
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Root route handler
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Главная страница API',
        endpoints: ['/api/faq', '/api/library', '/api/videos', '/health']
    });
});

// Catch-all for 404
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Проверьте работу:');
    console.log(`curl http://localhost:${PORT}/`);
});
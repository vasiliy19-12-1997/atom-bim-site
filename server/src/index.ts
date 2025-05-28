import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Минимальная конфигурация
app.use(cors());
app.use(express.json());

// Явный обработчик для всех путей
app.get('*', (req, res) => {
    console.log(`Получен запрос на: ${req.path}`);
    
    if (req.path === '/') {
        return res.json({
            status: 'OK',
            message: 'Главная страница API',
            endpoints: ['/api/faq', '/api/library', '/api/videos', '/health']
        });
    }

    res.status(404).json({ error: 'Маршрут не найден' });
});

// Запуск сервера с подробным логом
const server = app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log('Проверьте работу:');
    console.log(`curl http://localhost:${PORT}/`);
});

// Логирование всех запросов
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
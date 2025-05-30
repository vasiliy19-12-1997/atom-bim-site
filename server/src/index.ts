import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import faqRoutes from './routes/faqRoutes';
import libraryRoutes from './routes/libraryRoutes';
import videoRoutes from './routes/videoRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));

// Routes
app.use('/api/video', videoRoutes);
app.use('/api/faq', faqRoutes);
app.use('/api/library', libraryRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
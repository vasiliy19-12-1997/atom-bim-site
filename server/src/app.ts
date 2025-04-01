import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import videoRoutes from "./Routes/videoRoutes.js";
import faqRoutes from "./Routes/faqRoutes.js";
import libraryRoutes from "./Routes/libraryRoutes.js";
import eirRoutes from "./Routes/eirRoutes.js";
import fileUpload from "express-fileupload";

const app = express();
const PORT = process.env.PORT || 5000;

// Список разрешённых Origin
const allowedOrigins = [
  "http://localhost:3000", // локальный клиент (если используется порт 3000)
  "https://atom-bim-site-client.vercel.app/", // продакшен домен клиента
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Если нет origin (например, для curl или postman) — разрешаем
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use("/api/videos", videoRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/eir", eirRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

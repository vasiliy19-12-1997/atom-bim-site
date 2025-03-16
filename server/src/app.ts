import express from "express";
import cors from "cors";
import videoRoutes from "./Routes/videoRoutes.js"; // убираем .js

const app = express();
const getRandomPort = () =>
  Math.floor(Math.random() * (65535 - 1024 + 1)) + 1024;

const PORT = getRandomPort();

console.log(`Сервер запускается на порту: ${PORT}`);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/videos", videoRoutes);

// Статика для фронта (если нужно)
app.use(express.static("../client/dist"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import videoRoutes from "./Routes/videoRoutes.js";
import faqRoutes from "./Routes/faqRoutes.js";
import libraryRoutes from "./Routes/libraryRoutes.js";

const app = express();
const PORT = 5000;

//middleware
app.use(cors());
app.use(express.json());

app.use("/api/videos", videoRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/library", libraryRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на :https://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import videoRoutes from "./Routes/videoRoutes.js";
import faqRoutes from "./Routes/faqRoutes.js";
import libraryRoutes from "./Routes/libraryRoutes.js";
import eirRoutes from "./Routes/eirRoutes.js";
import fileUpload from "express-fileupload";

const app = express();
const PORT = 5000;

// Middleware
app.use(
  cors({
    origin:
      "https://atom-bim-site-client-rjhjd34i6-vasiliy19121997s-projects.vercel.app/",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use("/api/videos", videoRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/eir", eirRoutes);

app.listen(PORT, () => {
  console.log(`Сервер запущен на :https://localhost:${PORT}`);
});
// Для Vercel Serverless
module.exports = app;

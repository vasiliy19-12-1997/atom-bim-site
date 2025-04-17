import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import videoRoutes from "../src/Routes/videoRoutes.js";
import faqRoutes from "../src/Routes/faqRoutes.js";
import libraryRoutes from "../src/Routes/libraryRoutes.js";
import eirRoutes from "../src/Routes/eirRoutes.js";

dotenv.config();
const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://atom-bim-site-client.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/videos", videoRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/eir", eirRoutes);

export default app;

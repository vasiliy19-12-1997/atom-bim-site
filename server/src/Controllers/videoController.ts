import { Request, Response } from "express";
import { atomVideoArray } from "../Data/videos.js";

export const getVideos = (req: Request, res: Response) => {
  try {
    res.status(200).json(atomVideoArray);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

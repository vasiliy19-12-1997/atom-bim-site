import { Request, Response } from "express";
import { atomLibraryArray } from "../Data/libraryArray.js";
export const getLibrary = (req: Request, res: Response) => {
  try {
    res.status(200).json(atomLibraryArray);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

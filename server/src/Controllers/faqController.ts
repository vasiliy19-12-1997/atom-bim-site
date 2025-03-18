import { Request, Response } from "express";
import { faqArray } from "../Data/faqArray.js";
export const getFaq = (req: Request, res: Response) => {
  try {
    res.status(200).json(faqArray);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

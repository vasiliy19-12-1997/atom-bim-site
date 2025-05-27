import { faqArray } from "data/faqArray";
import { Request, Response } from "express";

export const getFaq = (req?: Request, res?: Response) => {
  try {
    res?.status(200).json(faqArray);
  } catch (error) {
    res?.status(500).json({ message: "Server error" });
  }
};
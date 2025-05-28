import { Request, Response } from 'express';
import { faqArray } from '../data/faqArray';

export const getFaq = (req: Request, res: Response) => {
    res.status(200).json(faqArray);
};
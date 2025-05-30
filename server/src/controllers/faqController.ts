import { Request, Response } from 'express';
import { faqArray } from '../data/faqArray';

export const getFaqs = (req: Request, res: Response) => {
    try {
        res.status(200).json(faqArray);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching FAQs' });
    }
};
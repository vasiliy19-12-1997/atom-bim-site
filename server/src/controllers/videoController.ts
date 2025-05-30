import { Request, Response } from 'express';
import { atomVideoArray } from '../data/atomVideo';

export const getVideos = (req: Request, res: Response) => {
    try {
        res.status(200).json(atomVideoArray);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching videos' });
    }
};
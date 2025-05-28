import { atomVideoArray } from '../data/atomVideo';
import { Request, Response } from 'express';


export const getVideos = (req: Request, res: Response) => {
    res.status(200).json(atomVideoArray);
};
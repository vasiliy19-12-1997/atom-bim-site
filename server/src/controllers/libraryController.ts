import { Request, Response } from 'express';
import { atomLibraryArray } from '../data/libraryArray';

export const getLibraries = (req: Request, res: Response) => {
    try {
        res.status(200).json(atomLibraryArray);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching libraries' });
    }
};
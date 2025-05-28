import { atomLibraryArray } from '../data/libraryArray';
import { Request, Response } from 'express';


export const getLibrary = (req: Request, res: Response) => {
    res.status(200).json(atomLibraryArray);
};
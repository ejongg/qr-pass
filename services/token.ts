import { NextApiRequest } from 'next';
import jwt from 'jsonwebtoken';

export function requireToken(req: NextApiRequest) {
    if (!process.env.SECRET) {
        throw new Error('SECRET not set');
    }
    try {
        if (!req.headers.authorization) {
            throw new Error('No permission');
        }
        const [schema, token] = req.headers.authorization?.split(' ');

        if (schema !== 'Bearer') {
            throw new Error('No permission');
        }
        return jwt.verify(token, process.env.SECRET);
    } catch (err) {
        throw err;
    }
}

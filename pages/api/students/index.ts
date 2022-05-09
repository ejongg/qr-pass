import { NextApiRequest, NextApiResponse } from 'next';
import { Collection, database } from '../../../db';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.status(404);
        return;
    }
    const [db, client] = await database();
    try {
        const { search } = req.query;
        const cursor = db.collection(Collection.STUDENTS).find(
            search
                ? {
                      name: {
                          $regex: search,
                          $options: 'i',
                      },
                  }
                : {},
            {
                sort: { 'registration.createdAt': 'desc' },
            }
        );
        res.json(await cursor.toArray());
    } catch (err) {
        res.status(400).end();
        throw err;
    } finally {
        await client.close();
    }
}
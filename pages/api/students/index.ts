import { NextApiRequest, NextApiResponse } from 'next';
import { Collection, database } from '../../../db';
import { requireToken } from '../../../lib/token';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    let isAdmin = false;

    try {
        requireToken(req);
        isAdmin = true;
    } catch (err) {
        isAdmin = false;
    }

    const [db, client] = await database();
    try {
        const { search } = req.query;
        const cursor = db
            .collection(Collection.STUDENTS)
            .find(
                search
                    ? {
                          name: {
                              $regex: search,
                              $options: 'i',
                          },
                      }
                    : {},
                {
                    sort: !isAdmin ? {} : { registeredAt: 'desc' },
                    limit: !isAdmin ? 3 : 200,
                }
            )
            .project(!isAdmin ? { _id: 0, name: 1 } : {});
        res.json(await cursor.toArray());
    } catch (err) {
        res.status(400).end();
        throw err;
    } finally {
        await client.close();
    }
}

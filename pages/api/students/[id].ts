import { ObjectId } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Collection, database } from '../../../db';
import { requireToken } from '../../../lib/token';

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.status(404).end();
        return;
    }

    try {
        requireToken(req);
    } catch (err) {
        res.status(403).end('No permission');
        return;
    }

    const [db, client] = await database();
    try {
        const student = await db.collection(Collection.STUDENTS).findOne({ _id: new ObjectId(req.query.id as string) });
        if (!student) {
            res.status(400).end('Student not found');
            return;
        }

        const payload = JSON.parse(req.body);

        for (const key of Object.keys(payload)) {
            if (!['attendedAt', 'paidAt'].includes(key)) {
                res.status(400).end(`Cannot update ${key}`);
                return;
            }
        }

        await db.collection(Collection.STUDENTS).updateOne(
            {
                _id: student._id,
            },
            {
                $set: payload,
            }
        );
        const updated = await db.collection(Collection.STUDENTS).findOne({ _id: student._id });
        res.json(updated);
    } catch (err) {
        res.status(400).end();
        throw err;
    } finally {
        await client.close();
    }
}

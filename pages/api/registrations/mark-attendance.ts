import { NextApiRequest, NextApiResponse } from 'next';
import { Collection, database } from '../../../db';
import { requireToken } from '../../../services/token';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
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
        const { qrcode } = JSON.parse(req.body);
        console.log(qrcode);
        const student = await db.collection(Collection.STUDENTS).findOne({ qrcode });
        if (!student) {
            res.status(400).end('Student not found');
            return;
        }
        await db.collection(Collection.STUDENTS).updateOne({ _id: student._id }, { $set: { attendedAt: new Date() } });
        const updated = await db.collection(Collection.STUDENTS).findOne({ _id: student._id });
        res.json(updated);
    } catch (err) {
        res.status(400).end();
        throw err;
    } finally {
        await client.close();
    }
};

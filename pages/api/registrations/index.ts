import { NextApiRequest, NextApiResponse } from 'next';
import { Collection, database } from '../../../db';

export default (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            handlePOST(req, res);
            break;
        case 'GET':
            handleGET(req, res);
            break;
        default:
            res.status(404).end();
    }
};

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
    const [db, client] = await database();
    try {
        const inserted = await db.collection(Collection.REGISTRATIONS).insertOne({
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const registration = await db.collection(Collection.REGISTRATIONS).findOne({ _id: inserted.insertedId });
        res.status(201).json(registration);
    } catch (err) {
        res.status(400).end();
    } finally {
        await client.close();
    }
}

async function handleGET(_: NextApiRequest, res: NextApiResponse) {
    const [db, client] = await database();
    try {
        const cursor = db.collection(Collection.REGISTRATIONS).find();
        res.status(200).json(await cursor.toArray());
    } catch (err) {
        res.status(400).end();
    } finally {
        await client.close();
    }
}

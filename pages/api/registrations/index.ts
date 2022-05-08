import { NextApiRequest, NextApiResponse } from 'next';
import { Collection, database, IRegistration, IStudent } from '../../../db';
import * as crypto from 'crypto';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    switch (req.method) {
        case 'POST':
            await handlePOST(req, res);
            break;
        case 'GET':
            await handleGET(req, res);
            break;
        default:
            res.status(404).end();
    }
};

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
    const [db, client] = await database();
    try {
        const student = await db.collection(Collection.STUDENTS).findOne<IStudent>({ name: req.body.name });
        if (!student) {
            res.status(400).send({ message: 'Student not found' });
            return;
        }

        const found = await db.collection(Collection.REGISTRATIONS).findOne<IRegistration>({ name: req.body.name });
        if (found) {
            res.status(201).json(found);
            return;
        }

        const now = new Date();
        const qrcode = crypto
            .createHash('md5')
            .update(student.name + student.course + process.env.SECRET)
            .digest('hex');
        const inserted = await db.collection(Collection.REGISTRATIONS).insertOne({
            name: student.name,
            course: student.course,
            qrcode,
            createdAt: now,
            updatedAt: now,
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

import * as crypto from 'crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import { Collection, database, IStudent } from '../../../db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(404).end();
    }
    const [db, client] = await database();
    try {
        const student = await db.collection(Collection.STUDENTS).findOne<IStudent>({ name: req.body.name });
        if (!student) {
            res.status(400).send({ message: 'Student not found' });
            return;
        }

        if (student.registration) {
            res.status(201).json(student);
            return;
        }

        const now = new Date();
        const qrcode = crypto
            .createHash('md5')
            .update(student.name + student.course + process.env.SECRET)
            .digest('hex');

        await db.collection(Collection.STUDENTS).updateOne(
            { _id: student._id },
            {
                $set: {
                    registration: {
                        qrcode,
                        createdAt: now,
                        updatedAt: now,
                    },
                },
            }
        );
        res.status(201).json(student);
    } catch (err) {
        res.status(400).end();
        throw err;
    } finally {
        await client.close();
    }
};

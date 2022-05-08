import { NextApiRequest, NextApiResponse } from 'next';
import { Collection, database } from '../../../db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'PUT') {
        res.status(404).end();
        return;
    }
    const [db, client] = await database();
    try {
        const registrationCollection = db.collection(Collection.REGISTRATIONS);

        const { qrcode } = req.query;
        const registration = await registrationCollection.findOne({ qrcode });
        if (!registration) {
            res.status(400).end();
            return;
        }
        await registrationCollection.updateOne({ qrcode }, { attendedAt: new Date() });
        const updated = await registrationCollection.findOne({ _id: registration._id });
        res.json(updated);
    } catch (err) {
        res.status(500).send({ message: err });
        return;
    } finally {
        await client.close();
    }
};

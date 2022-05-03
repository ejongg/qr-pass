import { NextApiRequest, NextApiResponse } from 'next'
import { Collection, database } from '../../../db'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') {
        res.status(404).end()
        return
    }
    const [db, client] = await database()
    try {
        const inserted = await db.collection(Collection.REGISTRATIONS).insertOne({
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        const registration = await db.collection(Collection.REGISTRATIONS).findOne({ _id: inserted.insertedId })
        res.status(201).json(registration)
    } catch (err) {
        res.status(400).end()
    } finally {
        await client.close()
    }   
    
}
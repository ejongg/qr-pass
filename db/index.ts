import { Db, MongoClient, ServerApiVersion } from 'mongodb';

export enum Collection {
    REGISTRATIONS = 'registrations'
}

export const database = async (): Promise<[Db, MongoClient]> => {
    if (!process.env.DB_URL) {
        throw new Error('DB_URL is not SET')
    }
    const client = new MongoClient(process.env.DB_URL, { serverApi: ServerApiVersion.v1 })
    await client.connect()
    return [client.db(process.env.DB_NAME), client]
}
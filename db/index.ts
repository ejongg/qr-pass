import { Db, MongoClient, ObjectId, ServerApiVersion } from 'mongodb';

export enum Collection {
    REGISTRATIONS = 'registrations',
    STUDENTS = 'students',
}

export const database = async (): Promise<[Db, MongoClient]> => {
    if (!process.env.DB_URL) {
        throw new Error('DB_URL is not SET');
    }
    const client = new MongoClient(process.env.DB_URL, { serverApi: ServerApiVersion.v1 });
    await client.connect();
    return [client.db(process.env.DB_NAME), client];
};

export interface IStudent {
    _id: ObjectId;
    name: string;
    course: string;
}

export interface IRegistration {
    _id: ObjectId;
    name: string;
    course: string;
    createdAt: Date;
    updatedAt: Date;
    qrcode: string;
}

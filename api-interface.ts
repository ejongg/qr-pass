export interface Student {
    _id: string;
    name: string;
    course: string;
    registration?: {
        paidAt?: string;
        attendedAt?: string;
        qrcode: string;
        createdAt: string;
        updatedAt: string;
    };
}

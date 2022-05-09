export interface Student {
    _id: string;
    name: string;
    course: string;
    registration?: {
        paidAt: string | null;
        attendedAt: string | null;
        qrcode: string;
        createdAt: string;
        updatedAt: string;
    };
}

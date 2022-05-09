export interface Student {
    _id: string;
    name: string;
    course: string;
    paidAt: string | null;
    attendedAt: string | null;
    qrcode?: string;
    registeredAt?: string;
}

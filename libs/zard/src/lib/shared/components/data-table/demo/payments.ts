export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}

export const PAYMENTS: Payment[] = [
  { id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: '3u1reuv4', amount: 242, status: 'success', email: 'Abe45@example.com' },
  { id: 'derv1ws0', amount: 837, status: 'processing', email: 'Monserrat44@example.com' },
  { id: '5kma53ae', amount: 874, status: 'success', email: 'Silas22@example.com' },
  { id: 'bhqecj4p', amount: 721, status: 'failed', email: 'carmella@example.com' },
  { id: 'p8x2kq7n', amount: 129, status: 'pending', email: 'lena.ortiz@example.com' },
  { id: 'z4m9d1rt', amount: 563, status: 'success', email: 'omar_h@example.com' },
  { id: 'c7v0w2yb', amount: 98, status: 'failed', email: 'june.park@example.com' },
  { id: 'q1n6s8ue', amount: 450, status: 'processing', email: 'theo.martin@example.com' },
  { id: 'h3j5l9fa', amount: 287, status: 'success', email: 'ines.costa@example.com' },
  { id: 'w2e8r4tz', amount: 690, status: 'pending', email: 'noah.b@example.com' },
  { id: 'k9b3x7cm', amount: 145, status: 'success', email: 'maya.lee@example.com' },
];

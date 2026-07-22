import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roa-Art',
  description: 'A refined online gallery for original artwork and commissions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

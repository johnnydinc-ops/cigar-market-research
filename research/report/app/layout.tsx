import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'US Cigar Buyer Platform — Market Research & Strategy Brief',
  description: 'Recommendation + deal-finding opportunity assessment for the US cigar market.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

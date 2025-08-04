import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Red Health - Smart Discount Allocation Engine',
  description: 'A tool to fairly distribute discount kitty among Red Health sales agents based on performance metrics',
  icons: {
    icon: '/red-health-logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans bg-gray-50">{children}</body>
    </html>
  );
}

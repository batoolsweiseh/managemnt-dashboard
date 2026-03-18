import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TaskFlow Dashboard',
  description: 'Manage your tasks efficiently with TaskFlow.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const role = session?.user ? (session.user as any)?.role : undefined;

  return (
    <html lang="en" data-role={role} suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/30`}
      >
        <div className="bg-animated-mesh" />
        <Navbar session={session} />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}

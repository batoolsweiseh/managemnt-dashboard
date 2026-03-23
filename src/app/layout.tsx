import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { auth } from '@/auth';
import { Toaster } from 'sonner';
import QueryProvider from '@/components/QueryProvider';

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
        <QueryProvider>
          <div className="bg-animated-mesh" />
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(228, 228, 231, 0.4)',
                borderRadius: '1.5rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                padding: '1.25rem',
              },
            }}
          />
          <Navbar session={session} />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}

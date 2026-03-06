import type { Metadata } from 'next';
import { AppProvider } from '@/context/AppContext';
import { SignInWarning } from '@/components/SignInWarning';
import './globals.css';

export const metadata: Metadata = {
  title: 'Handicraft Online Store',
  description: 'Authentic handmade products crafted by skilled artisans',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <SignInWarning />
          <div className="app">{children}</div>
        </AppProvider>
      </body>
    </html>
  );
}

import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'GlobeJobs - Find Your Dream Job Worldwide',
  description: 'Search and discover job opportunities from around the world. Connect with top employers and find your perfect career match.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex">
                  <div className="flex-shrink-0 flex items-center">
                    <h1 className="text-xl font-bold text-primary">GlobeJobs</h1>
                  </div>
                </div>
                <div className="flex items-center">
                  <button className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
}

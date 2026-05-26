import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IEX Real-Time Results - South Africa',
  description: 'Mocked Real-Time Election Results System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="navbar navbar-expand-lg navbar-dark navbar-official mb-4">
          <div className="container">
            <a className="navbar-brand d-flex align-items-center gap-2" href="/">
              <span className="fs-3">🇿🇦</span>
              <strong>IEX Results Center</strong>
            </a>
            <div className="navbar-nav ms-auto flex-row gap-3 align-items-center">
              <a className="btn btn-primary btn-sm fw-bold px-3" href="/vote">Vote Online</a>
              <a className="nav-link" href="/">Dashboard</a>
              <a className="nav-link" href="/station">Station Portal</a>
              <a className="nav-link" href="/verify">Verify Vote</a>
              <a className="nav-link" href="/admin">Admin</a>
            </div>
          </div>
        </nav>
        <div className="container pb-5">
          {children}
        </div>
        <footer className="text-center py-4 text-muted border-top mt-5">
          <small>Mock Application for Demonstration Purposes Only</small>
        </footer>
      </body>
    </html>
  );
}
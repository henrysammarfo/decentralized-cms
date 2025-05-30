// frontend/src/components/Layout/Layout.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { FileEdit, Home, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const currentAccount = useCurrentAccount();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2">
                <FileEdit className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">
                  Decentralized CMS
                </span>
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                <Link 
                  to="/" 
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                
                {currentAccount && (
                  <Link 
                    to="/editor" 
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                  >
                    <FileEdit className="h-4 w-4" />
                    <span>Editor</span>
                  </Link>
                )}
              </nav>
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              {currentAccount && (
                <div className="hidden md:block text-sm text-gray-600">
                  Connected: {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
                </div>
              )}
              <ConnectButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Decentralized CMS - Built on Sui & Walrus</p>
            <p className="text-sm mt-2">
              Open source project powered by blockchain technology
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
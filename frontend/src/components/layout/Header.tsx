import { ConnectButton } from '@mysten/dapp-kit';
import { Wallet } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-full">
            <img 
              src="/walrus-logo.svg" 
              alt="Walrus CMS" 
              className="h-8 w-8"
            />
          </div>
          <h1 className="text-2xl font-bold">Walrus CMS</h1>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <a href="/" className="hover:text-primary-200 transition-colors">Home</a>
          <a href="/dashboard" className="hover:text-primary-200 transition-colors">Dashboard</a>
          <a href="/editor" className="hover:text-primary-200 transition-colors">Editor</a>
          <a href="#" className="hover:text-primary-200 transition-colors">Templates</a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <ConnectButton 
            connectText={<><Wallet className="mr-2 h-4 w-4" /> Connect Wallet</>}
            connectedText="Connected"
            className="bg-white text-primary-700 hover:bg-gray-100 px-4 py-2 rounded-full font-medium transition-colors"
          />
        </div>
      </div>
    </header>
  );
};
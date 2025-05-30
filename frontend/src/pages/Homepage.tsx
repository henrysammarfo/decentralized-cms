// frontend/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { FileEdit, Globe, Shield, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  const currentAccount = useCurrentAccount();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Decentralized Content Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create, manage, and publish content on a fully decentralized platform 
          powered by Sui blockchain and Walrus storage. Own your content, control your data.
        </p>
        
        {currentAccount ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/editor"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FileEdit className="mr-2 h-5 w-5" />
              Start Writing
            </Link>
            <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Globe className="mr-2 h-5 w-5" />
              Browse Sites
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-yellow-800">
              Connect your wallet to start creating and managing content
            </p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold">Decentralized</h3>
          <p className="text-gray-600">
            No central server or single point of failure. Your content is stored 
            on the Walrus decentralized storage network.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Zap className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold">Permission-Based</h3>
          <p className="text-gray-600">
            Control who can edit your content with blockchain-based permissions. 
            Only authorized addresses can make changes.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileEdit className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold">Markdown Editor</h3>
          <p className="text-gray-600">
            Write content in Markdown with live preview. Simple, powerful, 
            and familiar to developers and writers alike.
          </p>
        </div>
      </div>

      {/* Status Section */}
      {currentAccount && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Your Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Account Status</h3>
              <p className="text-sm text-gray-600">
                Connected: {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
              </p>
              <p className="text-sm text-green-600">✓ Ready to create content</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Quick Actions</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to="/editor"
                  className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  New Page
                </Link>
                <button className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">
                  Manage Sites
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Getting Started */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
              1
            </div>
            <h4 className="font-semibold mb-1">Connect Wallet</h4>
            <p className="text-sm text-gray-600">Connect your Sui wallet to authenticate</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <h4 className="font-semibold mb-1">Create Site</h4>
            <p className="text-sm text-gray-600">Set up your CMS site with permissions</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <h4 className="font-semibold mb-1">Write Content</h4>
            <p className="text-sm text-gray-600">Use the Markdown editor to create pages</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">
              4
            </div>
            <h4 className="font-semibold mb-1">Publish</h4>
            <p className="text-sm text-gray-600">Content is stored on Walrus and rendered via Walrus Sites</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
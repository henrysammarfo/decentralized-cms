import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-primary-800 mb-6">
          Decentralized CMS on Sui
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-10">
          Create, manage, and publish content with blockchain-powered permissions
        </p>
        <button className="btn btn-primary px-8 py-4 text-lg">
          Get Started
        </button>
      </div>
    </div>
  );
}
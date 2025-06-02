import React from 'react';

export default function SitePage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-primary-700 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Site Title</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <article className="prose max-w-none">
          <h2>Page Content</h2>
          <p>This is a sample page rendered from Walrus content.</p>
        </article>
      </main>
    </div>
  );
}
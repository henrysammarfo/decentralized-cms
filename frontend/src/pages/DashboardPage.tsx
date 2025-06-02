import { Header } from '@/components/layout/Header';
import { SiteCard } from '@/components/ui/SiteCard';
import { useState } from 'react';

export const DashboardPage = () => {
  const [sites, setSites] = useState([
    { 
      id: '1', 
      name: 'Company Blog', 
      description: 'Our official company blog', 
      pages: 12,
      lastUpdated: '2025-06-02',
      url: 'https://company.walrus.xyz'
    },
    { 
      id: '2', 
      name: 'Product Docs', 
      description: 'Documentation for our products', 
      pages: 24,
      lastUpdated: '2025-06-01',
      url: 'https://docs.walrus.xyz'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Sites</h1>
          <button className="btn btn-primary">
            + Create New Site
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map(site => (
            <SiteCard 
              key={site.id}
              site={site}
              onEdit={() => console.log('Edit site', site.id)}
              onDelete={() => setSites(sites.filter(s => s.id !== site.id))}
            />
          ))}
        </div>
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow p-6">
            <ul className="space-y-4">
              <li className="flex items-center border-b pb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">You published "Getting Started Guide"</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">You updated "API Reference"</p>
                  <p className="text-sm text-gray-500">Yesterday</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};
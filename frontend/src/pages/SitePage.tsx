// frontend/src/pages/SitePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Globe, Edit, FileText, Users, Settings } from 'lucide-react';

const SitePage: React.FC = () => {
  const { siteId, slug } = useParams<{ siteId: string; slug?: string }>();
  const currentAccount = useCurrentAccount();
  
  const [site, setSite] = useState<any>(null);
  const [page, setPage] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for now - will be replaced with actual blockchain queries
  useEffect(() => {
    const loadSiteData = async () => {
      setLoading(true);
      try {
        // TODO: Replace with actual blockchain queries
        // 1. Fetch site data from Sui
        // 2. Fetch pages list
        // 3. If slug provided, fetch specific page content from Walrus
        
        // Mock site data
        const mockSite = {
          id: siteId,
          name: 'My Decentralized Blog',
          owner: currentAccount?.address || '0x1234...',
          admins: [currentAccount?.address || '0x1234...'],
          editors: [],
          created_at: Date.now(),
        };

        const mockPages = [
          {
            id: '1',
            slug: 'welcome',
            title: 'Welcome to My Site',
            author: currentAccount?.address || '0x1234...',
            updated_at: Date.now(),
          },
          {
            id: '2',
            slug: 'about',
            title: 'About This Project',
            author: currentAccount?.address || '0x1234...',
            updated_at: Date.now() - 86400000,
          },
        ];

        setSite(mockSite);
        setPages(mockPages);

        if (slug) {
          const foundPage = mockPages.find(p => p.slug === slug);
          if (foundPage) {
            // Mock content - would be fetched from Walrus blob
            setPage({
              ...foundPage,
              content: `# ${foundPage.title}\n\nThis is the content for **${foundPage.title}**.\n\nThis content is stored on Walrus decentralized storage and rendered from blockchain data.\n\n## Features\n\n- Decentralized storage\n- Blockchain permissions\n- Markdown formatting\n- Live preview\n\n> This is a demo page showing how content would be displayed.`
            });
          } else {
            setError('Page not found');
          }
        }
      } catch (err) {
        setError('Failed to load site data');
        console.error('Load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSiteData();
  }, [siteId, slug, currentAccount]);

  const canEdit = (site: any) => {
    if (!currentAccount || !site) return false;
    return site.owner === currentAccount.address || 
           site.admins.includes(currentAccount.address) ||
           site.editors.includes(currentAccount.address);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="spinner"></div>
        <span className="ml-2">Loading site...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Back to Home
        </Link>
      </div>
    );
  }

  // Show specific page
  if (slug && page) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">→</span>
            <Link to={`/site/${siteId}`} className="hover:underline">{site?.name}</Link>
            <span className="mx-2">→</span>
            <span>{page.title}</span>
          </nav>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
            {canEdit(site) && (
              <Link
                to={`/editor/${page.slug}`}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Link>
            )}
          </div>
          
          <div className="text-sm text-gray-500 mt-2">
            Last updated: {new Date(page.updated_at).toLocaleDateString()}
          </div>
        </div>

        {/* Page Content */}
        <article className="bg-white rounded-lg shadow-sm border p-8">
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {page.content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    );
  }

  // Show site overview
  return (
    <div className="max-w-6xl mx-auto">
      {/* Site Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Globe className="w-8 h-8 mr-3 text-blue-600" />
              {site?.name}
            </h1>
            <p className="text-gray-600 mt-1">
              Owner: {site?.owner.slice(0, 8)}...{site?.owner.slice(-6)}
            </p>
          </div>
          
          {canEdit(site) && (
            <div className="flex space-x-3">
              <Link
                to="/editor"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                New Page
              </Link>
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Site Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{pages.length}</p>
              <p className="text-gray-600">Pages</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">{site?.editors.length + site?.admins.length}</p>
              <p className="text-gray-600">Contributors</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-bold">Active</p>
              <p className="text-gray-600">Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Pages</h2>
        </div>
        
        {pages.length > 0 ? (
          <div className="divide-y">
            {pages.map((page) => (
              <div key={page.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <Link
                      to={`/site/${siteId}/${page.slug}`}
                      className="text-lg font-medium text-blue-600 hover:underline"
                    >
                      {page.title}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      /{page.slug} • Updated {new Date(page.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  
                  {canEdit(site) && (
                    <Link
                      to={`/editor/${page.slug}`}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No pages yet</p>
            {canEdit(site) && (
              <Link
                to="/editor"
                className="inline-flex items-center px-4 py-2 mt-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Create First Page
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SitePage;
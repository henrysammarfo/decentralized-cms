// frontend/src/pages/EditorPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentAccount } from '@mysten/dapp-kit';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Save, Eye, EyeOff, FileText } from 'lucide-react';

const EditorPage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('# Your Content Here\n\nStart writing your content in Markdown...');
  const [pageSlug, setPageSlug] = useState(slug || '');
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Redirect if not connected
  useEffect(() => {
    if (!currentAccount) {
      navigate('/');
    }
  }, [currentAccount, navigate]);

  const handleSave = async () => {
    if (!currentAccount) return;
    
    setIsSaving(true);
    try {
      // TODO: Implement actual save logic
      // 1. Upload content to Walrus as blob
      // 2. Update smart contract with blob ID
      console.log('Saving:', { title, content, slug: pageSlug });
      
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save content');
    } finally {
      setIsSaving(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slug) { // Only auto-generate slug for new pages
      setPageSlug(generateSlug(newTitle));
    }
  };

  if (!currentAccount) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please connect your wallet to access the editor.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {slug ? 'Edit Page' : 'Create New Page'}
          </h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              {isPreview ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
              {isPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !title.trim() || !content.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <div className="spinner mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Page Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Page Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter page title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Page Slug
            </label>
            <input
              id="slug"
              type="text"
              value={pageSlug}
              onChange={(e) => setPageSlug(e.target.value)}
              placeholder="page-url-slug"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="bg-white rounded-lg shadow-sm border">
        {isPreview ? (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Preview
            </h2>
            <div className="prose max-w-none">
              <h1>{title}</h1>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content (Markdown)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content in Markdown..."
              className="w-full h-96 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            />
            <div className="mt-2 text-xs text-gray-500">
              Tip: Use Markdown syntax for formatting. Click Preview to see how it looks.
            </div>
          </div>
        )}
      </div>

      {/* Markdown Help */}
      {!isPreview && (
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Markdown Quick Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-600">
            <div>
              <strong># Header 1</strong><br />
              <strong>## Header 2</strong>
            </div>
            <div>
              <strong>**Bold text**</strong><br />
              <strong>*Italic text*</strong>
            </div>
            <div>
              <strong>[Link](url)</strong><br />
              <strong>![Image](url)</strong>
            </div>
            <div>
              <strong>- List item</strong><br />
              <strong>`Code`</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorPage;
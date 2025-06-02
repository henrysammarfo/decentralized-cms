import { Header } from '@/components/layout/Header';
import { MarkdownEditor } from '@/components/editor/MarkdownEditor';
import { TemplateSelector } from '@/components/ui/TemplateSelector';
import { useState } from 'react';

export const EditorPage = () => {
  const [content, setContent] = useState(`# Welcome to Walrus CMS
  
## Create stunning decentralized content
  
Here are some features:
  
- **Markdown editing** with live preview
- **Media uploads** to Walrus storage
- **Blockchain permissions** via Sui
- **Professional templates** for your site
  
\`\`\`javascript
// Even code blocks work!
function helloWalrus() {
  console.log('Hello decentralized world!');
}
\`\`\`
`);
  const [selectedTemplate, setSelectedTemplate] = useState('blog');
  const [title, setTitle] = useState('Getting Started Guide');

  const templates = [
    { id: 'blog', name: 'Blog Template', category: 'Blog' },
    { id: 'docs', name: 'Documentation', category: 'Technical' },
    { id: 'portfolio', name: 'Portfolio', category: 'Creative' },
    { id: 'business', name: 'Business', category: 'Corporate' },
  ];

  const handlePublish = async () => {
    // Implementation would:
    // 1. Upload content to Walrus
    // 2. Update Sui contract
    // 3. Deploy site to Walrus Sites
    alert('Published successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Editor</h1>
            <p className="text-gray-600">Create and edit your decentralized content</p>
          </div>
          <button 
            onClick={handlePublish}
            className="btn btn-primary px-6 py-3 text-lg"
          >
            Publish to Walrus Site
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-3xl font-bold border-0 focus:ring-0 p-0 text-gray-900"
                placeholder="Page title"
              />
              <div className="flex mt-4">
                <input
                  type="text"
                  value="getting-started"
                  className="flex-1 bg-gray-100 border border-gray-300 rounded-l-lg px-4 py-2"
                  placeholder="page-slug"
                />
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-r-lg hover:bg-gray-300">
                  .walrus.xyz
                </button>
              </div>
            </div>
            
            <MarkdownEditor content={content} onChange={setContent} />
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Site Template</h2>
              <TemplateSelector 
                templates={templates}
                selected={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Collaborators</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                    <div className="ml-3">
                      <p className="font-medium">You</p>
                      <p className="text-sm text-gray-500">Owner</p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    Remove
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                    <div className="ml-3">
                      <p className="font-medium">satoshi.walrus</p>
                      <p className="text-sm text-gray-500">Editor</p>
                    </div>
                  </div>
                  <button className="text-red-600 hover:text-red-800 text-sm">
                    Remove
                  </button>
                </div>
                
                <div className="pt-4 border-t">
                  <button className="text-primary-600 hover:text-primary-800 font-medium flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add collaborator
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Page Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SEO Description
                  </label>
                  <textarea 
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Meta description for search engines"
                  />
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input 
                      type="checkbox"
                      className="rounded text-primary-600 focus:ring-primary-500"
                      defaultChecked
                    />
                    <span className="ml-2 text-gray-700">Publish immediately</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
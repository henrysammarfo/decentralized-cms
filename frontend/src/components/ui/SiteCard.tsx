import { Globe, Pencil, Trash2, BarChart2 } from 'lucide-react';

export const SiteCard = ({ 
  site, 
  onEdit, 
  onDelete 
}: {
  site: any;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Globe className="h-5 w-5 text-primary-600 mr-2" />
              {site.name}
            </h3>
            <p className="mt-2 text-gray-600">{site.description}</p>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-full"
              aria-label="Edit site"
            >
              <Pencil className="h-5 w-5" />
            </button>
            <button 
              onClick={onDelete}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
              aria-label="Delete site"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between text-sm text-gray-500">
          <div>
            <span className="font-medium">{site.pages}</span> pages
          </div>
          <div>Updated {site.lastUpdated}</div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="flex justify-between">
          <a 
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-800 font-medium flex items-center"
          >
            Visit Site
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button className="text-gray-600 hover:text-gray-900 flex items-center">
            <BarChart2 className="h-4 w-4 mr-1" />
            Analytics
          </button>
        </div>
      </div>
    </div>
  );
};
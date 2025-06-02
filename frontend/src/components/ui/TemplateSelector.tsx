import { useState } from 'react';

export const TemplateSelector = ({ 
  templates, 
  selected, 
  onSelect 
}: {
  templates: any[];
  selected: string;
  onSelect: (id: string) => void;
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', ...new Set(templates.map(t => t.category))];
  
  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div>
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {categories.map(category => (
          <button
            key={category}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-primary-100 text-primary-800'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
              selected === template.id
                ? 'border-primary-500 ring-2 ring-primary-200'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(template.id)}
          >
            <div className="bg-gray-200 border-b border-gray-300 aspect-video flex items-center justify-center">
              <div className="text-gray-500">Template Preview</div>
            </div>
            <div className="p-3">
              <div className="font-medium text-gray-900">{template.name}</div>
              <div className="text-xs text-gray-500">{template.category}</div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-4 text-primary-600 hover:text-primary-800 font-medium flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Browse more templates
      </button>
    </div>
  );
};
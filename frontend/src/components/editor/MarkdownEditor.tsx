import React from 'react'; // Add React import
import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import { MediaUpload } from './MediaUpload';

export const MarkdownEditor = ({ 
  content, 
  onChange 
}: {
  content: string;
  onChange: (value: string) => void;
}) => {
  const [showPreview, setShowPreview] = useState(true);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex border-b bg-gray-50">
        <button 
          className={`px-4 py-2 font-medium ${!showPreview ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
          onClick={() => setShowPreview(false)}
        >
          Edit
        </button>
        <button 
          className={`px-4 py-2 font-medium ${showPreview ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500'}`}
          onClick={() => setShowPreview(true)}
        >
          Preview
        </button>
        <div className="flex-1 flex justify-end p-2">
          <MediaUpload onUpload={(url) => onChange(`${content}\n![image](${url})\n`)} />
        </div>
      </div>
      
      <div className="h-[500px] overflow-auto">
        {showPreview ? (
          <div className="p-6 prose max-w-none">
            <MDEditor.Markdown source={content} />
          </div>
        ) : (
          <MDEditor
            value={content}
            onChange={(val) => onChange(val || '')}
            height={500}
            preview="edit"
            visibleDragbar={false}
          />
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t flex justify-between">
        <div className="text-sm text-gray-500">
          {content.length} characters, {content.split(/\s+/).length} words
        </div>
        <div>
          <button className="btn btn-secondary mr-2">Save Draft</button>
          <button className="btn btn-primary">Publish</button>
        </div>
      </div>
    </div>
  );
};
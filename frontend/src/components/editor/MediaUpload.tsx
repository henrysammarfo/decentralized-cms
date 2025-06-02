import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

export const MediaUpload = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Actual implementation would use Walrus service
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      const { url } = await response.json();
      onUpload(url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-primary-600">
        <UploadCloud className="h-5 w-5 mr-1" />
        <span>Upload Media</span>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*,video/*" 
          onChange={handleUpload} 
          disabled={isUploading}
        />
      </label>
      {isUploading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  );
};
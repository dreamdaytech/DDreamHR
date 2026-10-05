
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  documents: File[];
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  documents,
  onFileUpload,
  onRemoveFile
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="documents">Supporting Documents (Optional)</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          Click to upload or drag and drop files here
        </p>
        <Input
          type="file"
          multiple
          onChange={onFileUpload}
          className="hidden"
          id="file-upload"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Choose Files
        </Button>
      </div>
      
      {documents.length > 0 && (
        <div className="space-y-2">
          {documents.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

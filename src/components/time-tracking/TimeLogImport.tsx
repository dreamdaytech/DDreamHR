
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileInput, Upload } from "lucide-react";

const TimeLogImport = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "text/csv") {
        toast({
          title: "Invalid file type",
          description: "Please select a CSV file.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      toast({
        title: "Import Successful",
        description: `${selectedFile.name} has been imported successfully.`
      });
      setIsUploading(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }, 1500);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-2 space-y-6">
      <h2 className="text-xl font-semibold mb-4">Import Time Logs</h2>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
          <FileInput className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground mb-4">
            Upload a CSV file with your time logs data
          </p>
          <div className="flex flex-col gap-4 items-center">
            <Button 
              onClick={handleBrowseClick} 
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Browse Files
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          {selectedFile && (
            <div className="mt-4 text-sm text-primary">
              Selected file: {selectedFile.name}
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="template" className="text-sm">Need a template?</Label>
          <div className="mt-1">
            <Button variant="link" className="p-0 h-auto text-accent-500">
              Download CSV template
            </Button>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading}
          className="w-full bg-primary hover:bg-primary-700 text-white"
        >
          {isUploading ? (
            <>Uploading...</>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TimeLogImport;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, AlertCircle } from "lucide-react";

export default function FileUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (CSV or Excel)
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
        setError('Please upload a valid CSV or Excel file');
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/predictions/batch', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      // Reset form
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto mt-4">
      <div className="bg-card rounded-xl border shadow-sm p-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Batch Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload a CSV or Excel file containing student data for batch predictions
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="file-upload">Select File</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={uploading}
                className="cursor-pointer"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Accepted formats: CSV, XLSX, XLS
            </p>
          </div>

          {selectedFile && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button 
              onClick={handleUpload} 
              disabled={!selectedFile || uploading}
              className="w-full text-base font-semibold shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Uploading...' : 'Upload & Predict'}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <h4 className="text-sm font-medium mb-2">File Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>File must contain all required student fields</li>
              <li>Column headers should match the expected format</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { MetadataDisplay } from './components/MetadataDisplay';
import { extractMetadata } from './utils/exifParser';
import { ImageMetadata } from './types/metadata';
import { Shield, AlertCircle } from 'lucide-react';

function App() {
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError('');
    setMetadata(null);

    try {
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      const data = await extractMetadata(file);
      setMetadata(data);
    } catch (err) {
      setError('Failed to extract metadata. The image may not contain EXIF data or is corrupted.');
      console.error('Metadata extraction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setMetadata(null);
    setImageUrl('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">
              Image Metadata Analyzer
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Digital Forensics Tool - Extract EXIF Data for Investigation & Analysis
          </p>
        </header>

        <div className="flex flex-col items-center gap-8">
          {!metadata ? (
            <>
              <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
              {error && (
                <div className="flex items-center gap-2 bg-red-900/30 border border-red-500 text-red-200 px-4 py-3 rounded-lg max-w-2xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <MetadataDisplay metadata={metadata} imageUrl={imageUrl} />
              <button
                onClick={handleNewAnalysis}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Analyze Another Image
              </button>
            </>
          )}
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>All processing happens locally in your browser. No data is uploaded to any server.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

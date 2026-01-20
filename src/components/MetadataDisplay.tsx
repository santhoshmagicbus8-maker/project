import { Camera, Calendar, MapPin, Image as ImageIcon, Info, ExternalLink } from 'lucide-react';
import { ImageMetadata } from '../types/metadata';
import { formatFileSize, formatDate, getGoogleMapsUrl } from '../utils/exifParser';

interface MetadataDisplayProps {
  metadata: ImageMetadata;
  imageUrl: string;
}

export function MetadataDisplay({ metadata, imageUrl }: MetadataDisplayProps) {
  return (
    <div className="w-full max-w-6xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>

        <div className="space-y-4">
          <MetadataSection
            icon={<Info className="w-5 h-5" />}
            title="File Information"
            data={[
              { label: 'Filename', value: metadata.file.name },
              { label: 'File Size', value: formatFileSize(metadata.file.size) },
              { label: 'File Type', value: metadata.file.type },
              { label: 'Last Modified', value: formatDate(metadata.file.lastModified) },
              ...(metadata.dimensions
                ? [
                    {
                      label: 'Dimensions',
                      value: `${metadata.dimensions.width} × ${metadata.dimensions.height} px`,
                    },
                  ]
                : []),
            ]}
          />

          {metadata.camera && (
            <MetadataSection
              icon={<Camera className="w-5 h-5" />}
              title="Camera Information"
              data={[
                { label: 'Make', value: metadata.camera.make },
                { label: 'Model', value: metadata.camera.model },
                { label: 'Lens', value: metadata.camera.lens },
                { label: 'Software', value: metadata.camera.software },
              ]}
            />
          )}

          {metadata.capture && (
            <MetadataSection
              icon={<Calendar className="w-5 h-5" />}
              title="Capture Details"
              data={[
                { label: 'Date/Time', value: formatDate(metadata.capture.dateTime) },
                { label: 'ISO', value: metadata.capture.iso?.toString() },
                { label: 'Exposure Time', value: metadata.capture.exposureTime },
                { label: 'Aperture', value: metadata.capture.fNumber ? `f/${metadata.capture.fNumber}` : undefined },
                { label: 'Focal Length', value: metadata.capture.focalLength ? `${metadata.capture.focalLength}mm` : undefined },
                { label: 'Flash', value: metadata.capture.flash },
              ]}
            />
          )}

          {metadata.gps && (
            <MetadataSection
              icon={<MapPin className="w-5 h-5" />}
              title="GPS Location"
              data={[
                {
                  label: 'Coordinates',
                  value: `${metadata.gps.latitude?.toFixed(6)}, ${metadata.gps.longitude?.toFixed(6)}`,
                },
                { label: 'Altitude', value: metadata.gps.altitude ? `${metadata.gps.altitude}m` : undefined },
                { label: 'GPS Timestamp', value: formatDate(metadata.gps.timestamp) },
              ]}
            >
              {metadata.gps.latitude && metadata.gps.longitude && (
                <a
                  href={getGoogleMapsUrl(metadata.gps.latitude, metadata.gps.longitude)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                >
                  View on Map
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </MetadataSection>
          )}
        </div>
      </div>

      <ForensicImportance />
    </div>
  );
}

interface MetadataSectionProps {
  icon: React.ReactNode;
  title: string;
  data: Array<{ label: string; value?: string }>;
  children?: React.ReactNode;
}

function MetadataSection({ icon, title, data, children }: MetadataSectionProps) {
  const validData = data.filter((item) => item.value && item.value !== 'N/A');

  if (validData.length === 0 && !children) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-blue-400">{icon}</div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <dl className="space-y-2">
        {validData.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <dt className="text-gray-400 text-sm">{item.label}:</dt>
            <dd className="text-gray-200 text-sm font-medium text-right">{item.value}</dd>
          </div>
        ))}
      </dl>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

function ForensicImportance() {
  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 border border-yellow-600/30">
      <div className="flex items-start gap-3">
        <ImageIcon className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-yellow-400">Forensic Importance of Image Metadata</h3>
          <div className="space-y-2 text-gray-300 text-sm leading-relaxed">
            <p>
              <strong className="text-white">EXIF (Exchangeable Image File Format)</strong> data embedded in digital images is critical for forensic investigations:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong className="text-white">Authentication & Verification:</strong> Camera model, serial numbers, and software information help verify image authenticity and detect manipulation.
              </li>
              <li>
                <strong className="text-white">Timeline Establishment:</strong> Original capture timestamps help establish chronological sequences of events, crucial for alibis and incident reconstruction.
              </li>
              <li>
                <strong className="text-white">Location Intelligence:</strong> GPS coordinates pinpoint where photos were taken, linking suspects to crime scenes or refuting false claims.
              </li>
              <li>
                <strong className="text-white">Device Identification:</strong> Unique camera signatures can link multiple images to the same device, connecting evidence across cases.
              </li>
              <li>
                <strong className="text-white">Tampering Detection:</strong> Inconsistent metadata, missing data, or modified timestamps can indicate image manipulation or forgery.
              </li>
            </ul>
            <p className="pt-2 text-yellow-200">
              <strong>Privacy Note:</strong> This tool processes images entirely in your browser. No data is transmitted to external servers, maintaining evidence integrity and confidentiality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

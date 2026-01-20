export interface ImageMetadata {
  file: {
    name: string;
    size: number;
    type: string;
    lastModified: Date;
  };
  camera?: {
    make?: string;
    model?: string;
    lens?: string;
    software?: string;
  };
  capture?: {
    dateTime?: Date;
    iso?: number;
    exposureTime?: string;
    fNumber?: number;
    focalLength?: number;
    flash?: string;
    orientation?: number;
  };
  gps?: {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    timestamp?: Date;
  };
  dimensions?: {
    width?: number;
    height?: number;
  };
  raw?: Record<string, unknown>;
}

import exifr from 'exifr';
import { ImageMetadata } from '../types/metadata';

export async function extractMetadata(file: File): Promise<ImageMetadata> {
  const exifData = await exifr.parse(file, {
    tiff: true,
    exif: true,
    gps: true,
    iptc: true,
    icc: true,
    jfif: true,
  });

  const metadata: ImageMetadata = {
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified),
    },
  };

  if (exifData) {
    if (exifData.Make || exifData.Model) {
      metadata.camera = {
        make: exifData.Make,
        model: exifData.Model,
        lens: exifData.LensModel || exifData.LensInfo,
        software: exifData.Software,
      };
    }

    metadata.capture = {
      dateTime: exifData.DateTimeOriginal || exifData.DateTime || exifData.CreateDate,
      iso: exifData.ISO,
      exposureTime: exifData.ExposureTime ? formatExposureTime(exifData.ExposureTime) : undefined,
      fNumber: exifData.FNumber,
      focalLength: exifData.FocalLength,
      flash: exifData.Flash !== undefined ? formatFlash(exifData.Flash) : undefined,
      orientation: exifData.Orientation,
    };

    if (exifData.latitude && exifData.longitude) {
      metadata.gps = {
        latitude: exifData.latitude,
        longitude: exifData.longitude,
        altitude: exifData.GPSAltitude,
        timestamp: exifData.GPSDateStamp || exifData.GPSTimeStamp,
      };
    }

    if (exifData.ImageWidth || exifData.ImageHeight || exifData.ExifImageWidth || exifData.ExifImageHeight) {
      metadata.dimensions = {
        width: exifData.ExifImageWidth || exifData.ImageWidth,
        height: exifData.ExifImageHeight || exifData.ImageHeight,
      };
    }

    metadata.raw = exifData;
  }

  return metadata;
}

function formatExposureTime(value: number): string {
  if (value >= 1) {
    return `${value}s`;
  }
  const denominator = Math.round(1 / value);
  return `1/${denominator}s`;
}

function formatFlash(value: number): string {
  const flashFired = value & 0x01;
  return flashFired ? 'Flash fired' : 'Flash did not fire';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function formatDate(date: Date | undefined): string {
  if (!date) return 'N/A';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function getGoogleMapsUrl(lat: number, lon: number): string {
  return `https://www.google.com/maps?q=${lat},${lon}`;
}

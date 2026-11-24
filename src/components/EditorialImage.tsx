import { useState } from 'react';
import { Building2 } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function EditorialImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'UHS Medical Campus',
}: EditorialImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-100 via-teal-50/40 to-slate-200 flex flex-col items-center justify-center p-6 text-center ${className}`}
      >
        <Building2 className="w-8 h-8 text-teal-700 mb-2" />
        <span className="text-xs font-medium text-slate-600">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

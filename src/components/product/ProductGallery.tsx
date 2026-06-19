'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback if no images
  const safeImages = images && images.length > 0 ? images : ['/logo.png'];
  const currentImage = safeImages[activeIndex];

  // Touch handlers for swiping
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeIndex < safeImages.length - 1) {
      setActiveIndex(activeIndex + 1); // Swipe left, go to next
    } else if (isRightSwipe && activeIndex > 0) {
      setActiveIndex(activeIndex - 1); // Swipe right, go to prev
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative h-96 w-full rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Image
          src={currentImage}
          alt={name}
          fill
          className="object-contain p-4 select-none transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          draggable={false}
        />
        
        {/* Indicators for mobile */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 md:hidden">
            {safeImages.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-2 rounded-full transition-all ${idx === activeIndex ? 'w-6 bg-[var(--color-brand-blue)]' : 'w-2 bg-gray-300 dark:bg-gray-600'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails (Desktop mostly, but also scrollable on mobile) */}
      {safeImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
          {safeImages.map((img: string, idx: number) => (
            <div 
              key={idx} 
              onClick={() => setActiveIndex(idx)}
              className={`relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors snap-start
                ${activeIndex === idx ? 'border-[var(--color-brand-blue)] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}
              `}
            >
              <div className="absolute inset-0 bg-white/5 dark:bg-black/5" />
              <Image src={img} alt={`${name} - ${idx}`} fill className="object-cover" sizes="96px" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

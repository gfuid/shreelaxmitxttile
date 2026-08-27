import React from 'react';

export const SkeletonBox = ({ className = 'h-4 w-full', rounded = 'rounded-xl' }) => (
  <div className={`skeleton-shimmer ${rounded} ${className}`}></div>
);

export const SkeletonText = ({ lines = 3, className = 'space-y-2' }) => (
  <div className={className}>
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className={`skeleton-shimmer h-3.5 rounded-lg ${
          i === lines - 1 ? 'w-3/5' : i === 0 ? 'w-full' : 'w-4/5'
        }`}
      ></div>
    ))}
  </div>
);

export const SkeletonSareeCard = () => (
  <div className="bg-[#FAF6F0] rounded-2xl border border-[#E5DDD0] overflow-hidden shadow-xs space-y-3 p-3 flex flex-col justify-between">
    <div className="relative">
      <SkeletonBox className="h-64 sm:h-72 w-full rounded-xl" />
      <div className="absolute top-2 right-2">
        <SkeletonBox className="h-6 w-14 rounded-full" />
      </div>
    </div>
    <div className="space-y-2 px-1">
      <SkeletonBox className="h-4 w-3/4" />
      <SkeletonBox className="h-3 w-1/2" />
      <div className="flex items-center justify-between pt-1">
        <SkeletonBox className="h-5 w-20" />
        <SkeletonBox className="h-7 w-20 rounded-xl" />
      </div>
    </div>
  </div>
);

export const SkeletonHeroBanner = () => (
  <div className="w-full h-80 sm:h-[420px] rounded-3xl skeleton-shimmer flex items-center justify-center p-8">
    <div className="space-y-3 text-center max-w-md w-full">
      <SkeletonBox className="h-4 w-32 mx-auto rounded-full" />
      <SkeletonBox className="h-10 w-full rounded-xl" />
      <SkeletonBox className="h-4 w-3/4 mx-auto rounded-lg" />
      <SkeletonBox className="h-10 w-40 mx-auto rounded-full mt-4" />
    </div>
  </div>
);

export const SkeletonCategoryCarousel = () => (
  <div className="flex items-center gap-4 overflow-hidden py-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="w-32 shrink-0 space-y-2 text-center">
        <SkeletonBox className="h-24 w-24 mx-auto rounded-full" />
        <SkeletonBox className="h-3 w-16 mx-auto" />
      </div>
    ))}
  </div>
);

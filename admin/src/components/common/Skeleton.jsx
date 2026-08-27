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

export const SkeletonKpi = () => (
  <div className="bg-white p-5 rounded-2xl border border-[#E8E2D9] shadow-xs space-y-3">
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-3 w-24" />
      <SkeletonBox className="h-8 w-8 rounded-full" />
    </div>
    <SkeletonBox className="h-7 w-32" />
    <SkeletonBox className="h-4 w-20 rounded-full" />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 6 }) => (
  <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-xs overflow-hidden">
    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
      <SkeletonBox className="h-5 w-44" />
      <SkeletonBox className="h-8 w-28 rounded-xl" />
    </div>
    <div className="p-4 space-y-3">
      {[...Array(rows)].map((_, r) => (
        <div key={r} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50">
          <SkeletonBox className="h-4 w-28" />
          <SkeletonBox className="h-4 w-36" />
          <SkeletonBox className="h-4 w-24" />
          <SkeletonBox className="h-4 w-20" />
          <SkeletonBox className="h-6 w-16 rounded-full" />
          <SkeletonBox className="h-7 w-20 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonProductCard = () => (
  <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-xs overflow-hidden space-y-3 p-3">
    <SkeletonBox className="h-48 w-full rounded-xl" />
    <SkeletonBox className="h-4 w-3/4" />
    <div className="flex items-center justify-between">
      <SkeletonBox className="h-5 w-20" />
      <SkeletonBox className="h-4 w-12 rounded-full" />
    </div>
  </div>
);

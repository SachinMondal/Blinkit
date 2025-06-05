import React from "react";

const SkeletonBox = ({ className }) => (
  <div className={`bg-gray-300 animate-pulse rounded-md ${className}`} />
);

export default function HomeSkeleton() {
  return (
    <div className="max-w-5xl xl:max-w-6xl mx-auto mt-6 flex gap-16 xl:gap-24 flex-col overflow-hidden">
      <div className="w-full px-4">
        <SkeletonBox className="w-full h-[200px] lg:h-[300px] rounded-lg" />
      </div>

      
      <div className="w-full max-w-7xl mx-auto mt-4 px-4">
        <div className="flex flex-wrap gap-2">
          {[...Array(7)].map((_, i) => (
            <SkeletonBox key={i} className="w-24 h-24 sm:w-28 sm:h-28" />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4">
        {[...Array(3)].map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <SkeletonBox className="w-1/3 h-6" /> 
            <div className="flex gap-4 overflow-x-auto">
              {[...Array(5)].map((_, i) => (
                <SkeletonBox key={i} className="w-40 h-60 flex-shrink-0" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

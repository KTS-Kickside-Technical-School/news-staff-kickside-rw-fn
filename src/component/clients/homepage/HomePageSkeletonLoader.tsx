import React from 'react';

const HomePageSkeletonLoader = React.memo(() => (
  <div className="w-full flex flex-col lg:flex-row gap-4 animate-pulse">
    <div className="flex-1 h-[300px] sm:h-[400px] md:h-[500px] bg-gray-700 rounded-lg" />
    <div className="flex-1 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-[200px] bg-gray-700 rounded-lg" />
      ))}
    </div>
    <div className="flex-1 space-y-3">
      <div className="h-6 bg-gray-700 w-1/2 rounded" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-5 bg-gray-700 rounded" />
      ))}
    </div>
  </div>
));

export default HomePageSkeletonLoader;

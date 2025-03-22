'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface NewPostButtonProps {
  hotelId: string;
}

export default function NewPostButton({ hotelId }: NewPostButtonProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    router.push(`/dashboard/post`);
  };
  
  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all"
      aria-label="Schedule new post"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 6v6m0 0v6m0-6h6m-6 0H6" 
        />
      </svg>
      {isHovered && (
        <span className="absolute right-full mr-2 whitespace-nowrap bg-gray-800 text-white text-sm py-1 px-2 rounded">
          Schedule New Post
        </span>
      )}
    </button>
  );
}
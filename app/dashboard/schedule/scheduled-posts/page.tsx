'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import NewPostButton from '@/components/NewPostButton';

// Define TypeScript interfaces for our data
interface ScheduledPost {
  id: string;
  caption: string;
  imageUrl?: string;
  link?: string;
  scheduledAt: string;
  platforms: string[];
  status: 'SCHEDULED' | 'PROCESSING' | 'PUBLISHED' | 'FAILED' | 'CANCELLED';
  results?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  hotelId: string;
}

export default function ScheduledPostsPage() {
  const params = useParams();
  const hotelId = params.hotelId as string;
  
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<string | null>(null);
  
  // Function to fetch scheduled posts
  const fetchScheduledPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/scheduled-posts/${hotelId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch scheduled posts');
      }
      
      const data = await response.json();
      setPosts(data.data);
      setError(null);
    } catch (err) {
      setError('Error loading scheduled posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel a scheduled post
  const cancelPost = async (postId: string) => {
    if (!confirm('Are you sure you want to cancel this post?')) return;
    
    try {
      const response = await fetch(`/api/scheduled-posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel post');
      }
      
      // Refresh the posts list
      fetchScheduledPosts();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while cancelling the post');
      }
    }
  };
  
  // Fetch posts on component mount
  useEffect(() => {
    if (hotelId) {
      fetchScheduledPosts();
    }
  }, [hotelId]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Get all unique platforms from posts
  //const allPlatforms = [...new Set(posts.flatMap(post => post.platforms))];
  
  // Filter posts by platform if a filter is selected
  const filteredPosts = platformFilter
    ? posts.filter(post => post.platforms.includes(platformFilter))
    : posts;
  
  // Platform icon mapping
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return '📸';
      case 'facebook':
        return '👍';
      case 'twitter':
        return '🐦';
      case 'linkedin':
        return '💼';
      default:
        return '📱';
    }
  };
  
  // Status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Scheduled Social Media Posts</h1>
        
        {/* Stats overview */}
        <div className="flex space-x-4">
          <div className="bg-white p-2 rounded shadow-sm">
            <span className="block text-sm text-gray-500">Scheduled</span>
            <span className="font-semibold">{posts.filter(p => p.status === 'SCHEDULED').length}</span>
          </div>
          <div className="bg-white p-2 rounded shadow-sm">
            <span className="block text-sm text-gray-500">Processing</span>
            <span className="font-semibold">{posts.filter(p => p.status === 'PROCESSING').length}</span>
          </div>
          <div className="bg-white p-2 rounded shadow-sm">
            <span className="block text-sm text-gray-500">Published</span>
            <span className="font-semibold">{posts.filter(p => p.status === 'PUBLISHED').length}</span>
          </div>
        </div>
      </div>
      
      {/* Platform filter */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <h2 className="font-semibold">Filter by platform:</h2>
          <button 
            onClick={() => setPlatformFilter(null)}
            className={`px-3 py-1 rounded-full text-sm ${!platformFilter ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          {['instagram', 'facebook', 'twitter', 'linkedin'].map(platform => (
            <button
              key={platform}
              onClick={() => setPlatformFilter(platform)}
              className={`px-3 py-1 rounded-full text-sm ${platformFilter === platform ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >
              {getPlatformIcon(platform)} {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* No posts message */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No scheduled posts found</p>
            </div>
          ) : (
            /* Posts grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Post image preview */}
                  {post.imageUrl ? (
                    <div className="relative h-48 bg-gray-100">
                      <Image 
                        src={post.imageUrl}
                        alt="Post image"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ) : (
                    <div className="h-24 bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  
                  {/* Post content */}
                  <div className="p-4">
                    {/* Status badge */}
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(post.status)}`}>
                        {post.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(post.scheduledAt)}
                      </span>
                    </div>
                    
                    {/* Caption */}
                    <p className="text-sm mb-4 line-clamp-3">{post.caption}</p>
                    
                    {/* Platforms */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.platforms.map(platform => (
                        <span key={platform} className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-xs">
                          {getPlatformIcon(platform)} {platform}
                        </span>
                      ))}
                    </div>
                    
                    {/* Actions */}
                    {post.status === 'SCHEDULED' && (
                      <button
                        onClick={() => cancelPost(post.id)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded transition-colors text-sm"
                      >
                        Cancel Post
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {/* Refresh button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={fetchScheduledPosts}
          className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Posts'}
        </button>
      </div>
      
      {/* Add new post button */}
      <NewPostButton hotelId={hotelId} />
    </div>
  );
}
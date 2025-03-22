import React from 'react';

export default function HotelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { hotelId: string };
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold">Hotel Dashboard</h1>
          <p className="text-sm text-gray-500">Hotel ID: {params.hotelId}</p>
        </div>
      </header>
      
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <a href={`/dashboard/hotels/${params.hotelId}`} className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300">
              Overview
            </a>
            <a href={`/dashboard/hotels/${params.hotelId}/scheduled-posts`} className="py-4 px-2 border-b-2 border-gray-800 font-medium">
              Scheduled Posts
            </a>
            <a href={`/dashboard/hotels/${params.hotelId}/analytics`} className="py-4 px-2 border-b-2 border-transparent hover:border-gray-300">
              Analytics
            </a>
          </div>
        </div>
      </nav>
      
      <main>
        {children}
      </main>
    </div>
  );
}
'use client';
import React from 'react';
import Link from 'next/link';
import { Hotel, Image, Calendar, Menu, X, Instagram, Twitter, Facebook, Linkedin} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Hotel className="h-8 w-8 text-purple-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">HotelSocial</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-purple-600 font-medium">Features</Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-purple-600 font-medium">Testimonials</Link>
              <Link href="#pricing" className="text-gray-700 hover:text-purple-600 font-medium">Pricing</Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-purple-600 font-medium">Dashboard</Link>
              <Button className="bg-purple-600 text-white hover:bg-purple-700">Get Started</Button>
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <Link href="#features" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Features</Link>
              <Link href="#testimonials" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Testimonials</Link>
              <Link href="#pricing" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Pricing</Link>
              <Link href="/dashboard" className="block text-gray-700 hover:text-purple-600 font-medium py-2">Dashboard</Link>
              <Button className="w-full bg-purple-600 text-white hover:bg-purple-700">Get Started</Button>
            </div>
          )}
        </div>
      </nav>

      <div className="bg-white py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <h1 className="text-5xl font-bold tracking-tight mb-6 text-gray-900">
                Elevate Your Hotel's Social Presence
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Create, schedule, and manage stunning social media content with our AI-powered platform designed specifically for hotels and hospitality businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-purple-600 text-white hover:bg-purple-700">
                  Start Free Trial
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
                <img 
                  src="https://res.cloudinary.com/dgtdkqfsx/image/upload/v1742645494/DALL_E_2025-03-22_17.38.45_-_A_high-end_visually_appealing_illustration_for_a_landing_page_of_an_AI-powered_social_media_tool_for_small_hotels._The_scene_features_a_sleek_laptop_ebcjtg.webp" 
                  alt="Hotel social media platform dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="py-20 px-4 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Powerful Features</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Everything you need to create a stunning social media presence for your hotel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <Hotel className="w-12 h-12 mb-4 text-purple-600" />
                <CardTitle className="text-gray-900">AI Content Generation</CardTitle>
                <CardDescription className="text-gray-700">
                  Generate engaging captions and hashtags tailored to your hotel's brand and audience
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Button asChild className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  <Link href="/dashboard/content">Get Started</Link>
                </Button> */}
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <Image className="w-12 h-12 mb-4 text-purple-600" />
                <CardTitle className="text-gray-900">Visual Editor</CardTitle>
                <CardDescription className="text-gray-700">
                  Create stunning visuals with our drag-and-drop editor and hospitality-specific templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Button asChild className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  <Link href="/dashboard/editor">Create Post</Link>
                </Button> */}
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow">
              <CardHeader>
                <Calendar className="w-12 h-12 mb-4 text-purple-600" />
                <CardTitle className="text-gray-900">Schedule & Analyze</CardTitle>
                <CardDescription className="text-gray-700">
                  Plan your content calendar and track performance metrics across all social platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <Button asChild className="w-full bg-purple-600 text-white hover:bg-purple-700">
                  <Link href="/dashboard/schedule">Schedule Posts</Link>
                </Button> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div id="testimonials" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Trusted by Hoteliers</h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              See what hotel managers and marketing directors are saying about our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <span className="text-purple-600 font-bold">AB</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Alex Brown</h4>
                    <p className="text-gray-600">Marketing Director, Luxury Hotel Chain</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "This platform has transformed how we manage our social media. We've seen a 40% increase in engagement since we started using it."
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-20 px-4 bg-purple-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">Ready to Transform Your Hotel's Social Media?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of hotels already using our platform to create stunning social media content
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            Start Your Free 14-Day Trial
          </Button>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Hotel className="h-8 w-8 text-purple-400 mr-2" />
                <span className="text-xl font-bold">HotelSocial</span>
              </div>
              <p className="text-gray-400 mb-4">
                The ultimate social media management platform for hotels and hospitality businesses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Case Studies</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Reviews</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Webinars</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4 text-lg">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} HotelSocial. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
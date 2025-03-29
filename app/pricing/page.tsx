'use client'

import React, { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText?: string;
}

declare global {
    interface Window {
      Razorpay: any;
    }
  }

const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  price, 
  description, 
  features, 
  popular = false, 
  buttonText = "Get Started" 
}) => {
    const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          setIsRazorpayLoaded(true);
        };
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);
    const router = useRouter();

    const createOrder = async () => {
        const res = await fetch("/api/generateOrders", {
          method: "POST",
          body: JSON.stringify({ amount: price * 100 }),
        });
        const data = await res.json();
        if (!isRazorpayLoaded) {
            console.error('Razorpay SDK is not loaded yet');
            return;
          }
        const paymentData = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
          order_id: data.id,
    
          handler: async function (response: any) {
            // verify payment
            const res = await fetch("/api/verifyOrders", {
              method: "POST",
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const data = await res.json();
            if (data.isOk) {
                router.push('/dashboard');
              alert("Payment successful");
            } else {
              alert("Payment failed");
            }
          },
        };
        
        try {
            const razorpayInstance = new window.Razorpay(paymentData);
            razorpayInstance.open();
          } catch (error) {
            console.error('Razorpay initialization failed:', error);
          }
      };
      
  return (
    <Card className={`w-full max-w-md border ${popular ? 'border-purple-600 shadow-lg' : 'border-gray-200'}`}>
      <CardHeader className="space-y-1">
        {popular && (
          <div className="bg-purple-600 text-white text-xs font-medium px-3 py-1 rounded-full w-fit mb-2">
            Most Popular
          </div>
        )}
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <div className="flex items-baseline text-3xl font-extrabold">
          Rs.{price}
          <span className="ml-1 text-lg font-medium text-gray-500">/month</span>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <Check className="h-5 w-5 text-purple-600 mr-2 shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
        onClick={createOrder}
          className={`w-full ${popular ? 'bg-purple-600 hover:bg-purple-700' : 'bg-white text-purple-600 border border-purple-600 hover:bg-gray-50'}`}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function PricingPage() {
  const pricingPlans = [
    {
      title: "Basic",
      price: 29,
      description: "Perfect for small businesses just getting started",
      features: [
        "5 AI image generations per day",
        "Basic template access",
        "Standard customer support",
        "Mobile app access",
        "Simple analytics dashboard"
      ],
      popular: false
    },
    {
      title: "Professional",
      price: 79,
      description: "Ideal for growing businesses with higher volume needs",
      features: [
        "50 AI image generations per day",
        "Full template library access",
        "Priority customer support",
        "Advanced analytics",
        "API access",
        "Team collaboration tools",
        "Custom branding options"
      ],
      popular: true
    },
    {
      title: "Enterprise",
      price: 199,
      description: "Comprehensive solution for large organizations",
      features: [
        "Unlimited AI image generations",
        "Dedicated account manager",
        "24/7 premium support",
        "Custom integration options",
        "Advanced security features",
        "User role management",
        "White-label solutions",
        "Custom model training"
      ],
      popular: false
    }
  ]

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-purple-600 tracking-wide uppercase">Pricing</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl">
            Choose the right plan for your business
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            All plans include access to our AI image generation platform with different usage limits and features.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard 
              key={index}
              title={plan.title}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              popular={plan.popular}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
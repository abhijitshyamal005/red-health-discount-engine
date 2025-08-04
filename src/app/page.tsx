'use client';

import { useState } from 'react';
import Image from 'next/image';
import AllocationForm from '@/components/AllocationForm';
import AllocationResults from '@/components/AllocationResults';
import { DiscountInput, DiscountOutput } from '@/types';

export default function Home() {
  const [results, setResults] = useState<DiscountOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (input: DiscountInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to calculate allocation');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error calculating allocation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Top bar for navigation */}
      <div className="w-full bg-gray-100 text-black text-xs py-2 tracking-wide flex justify-end pr-8">
        <ul className="flex space-x-6">
          {['OUR PRESENCE', 'NEWS', 'CAREERS', 'CONTACT US', 'BLOG'].map((item) => (
            <li key={item}>
              <a
                href="#"
                className="hover:underline hover:underline-offset-4 hover:decoration-red-500 transition-colors duration-200"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <header className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <Image src="/logo.webp" alt="Red Health Logo" width={200} height={60} className="h-15 w-50" />
        
        <ul className="flex space-x-6 items-center">
          {['ABOUT US', 'SOLUTIONS', 'PRODUCTS', 'FARE ESTIMATOR', 'BOOK AN AMBULANCE'].map((item, idx, arr) => (
            <li key={item}>
              <a
                href="#"
                className={
                  `text-base md:text-lg font-sans transition-colors duration-200 ` +
                  (idx === arr.length - 1
                    ? 'border border-red-500 rounded-3xl px-4 py-2 hover:bg-red-500 hover:text-white hover:no-underline'
                    : 'hover:underline hover:underline-offset-4 hover:decoration-red-500')
                }
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-800 sm:text-4xl">
            Smart Discount Allocation Engine
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
            Fairly distribute your discount kitty among Red Health sales agents based on performance metrics
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 border border-red-health-300">
            <AllocationForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
      
          <div>
            {error && (
              <div className="rounded-md bg-white p-4 mb-6 border border-red-500">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-500">Error</h3>
                    <div className="mt-2 text-sm text-red-500">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
      
            {results && <AllocationResults results={results} />}
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-100 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="flex items-center space-x-3">
            <Image src="/logo.webp" alt="Red Health Logo" width={200} height={60} className="h-15 w-50" />
          </div>
            </div>
            <p className="text-sm text-black">© {new Date().getFullYear()} Red Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

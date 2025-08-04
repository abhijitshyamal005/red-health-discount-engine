'use client';

import { useState } from 'react';
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
    <main className="min-h-screen bg-red-health-50">
      {/* Top bar for branding or notification */}
      <div className="w-full bg-red-health-50 text-white text-xs py-1 text-center tracking-wide">
        Empowering Sales Teams with Smart Discount Allocation
      </div>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/logo.webp" alt="Red Health Logo" className="h-15 w-50" />
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-red-health-800 sm:text-4xl">
            Smart Discount Allocation Engine
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-600 sm:mt-4">
            Fairly distribute your discount kitty among Red Health sales agents based on performance metrics
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 border border-red-health-100">
            <AllocationForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>

          <div>
            {error && (
              <div className="rounded-md bg-red-health-50 p-4 mb-6 border border-red-health-200">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-health-800">Error</h3>
                    <div className="mt-2 text-sm text-red-health-700">
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
      
      <footer className="bg-red-health-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img src="/red-health-logo.svg" alt="Red Health Logo" className="h-8 w-8 filter brightness-0 invert" />
              <span className="font-semibold">Red Health</span>
            </div>
            <p className="text-sm text-red-health-100">© {new Date().getFullYear()} Red Health. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

'use client';

import { DiscountOutput, DiscountSituation } from '@/types';

interface AllocationResultsProps {
  results: DiscountOutput | null;
}

// Situation descriptions for display
const SITUATION_DESCRIPTIONS = {
  standard: 'Regular discount allocation based on agent performance metrics',
  seasonal: 'Special seasonal promotions with higher emphasis on recent performance',
  newProduct: 'New product launch with focus on experienced agents',
  competitiveResponse: 'Response to competitor actions with emphasis on target achievement',
  customerRetention: 'Focus on retaining existing customers with emphasis on active clients',
};

export default function AllocationResults({ results }: AllocationResultsProps) {
  if (!results) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-red-500">Allocation Results</h2>

      <div className="overflow-hidden bg-white shadow-lg rounded-lg border border-red-health-300">
        <div className="px-4 py-5 sm:px-6 bg-white">
          <h3 className="text-lg font-medium leading-6 text-red-500">Summary</h3>
          {results.situation && (
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              Situation: <span className="font-medium text-red-500">
                {results.situation.charAt(0).toUpperCase() + results.situation.slice(1)}
              </span>
              <span className="block text-xs mt-1">{SITUATION_DESCRIPTIONS[results.situation]}</span>
            </p>
          )}
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Total allocated: <span className="font-medium text-red-500">₹{results.summary?.totalAllocated.toLocaleString()}</span>
          </p>
          {results.summary?.remainingKitty !== 0 && (
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              Remaining kitty: <span className="font-medium text-red-500">₹{results.summary?.remainingKitty.toLocaleString()}</span>
            </p>
          )}
        </div>

        <div className="border-t border-red-health-300">
          <div className="bg-white px-4 py-3 sm:px-6">
            <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-600">
              <div className="col-span-2">Agent ID</div>
              <div className="col-span-3">Allocation</div>
              <div className="col-span-7">Justification</div>
            </div>
          </div>
          <ul className="divide-y divide-red-health-200">
            {results.allocations.map((allocation) => (
              <li key={allocation.id} className="px-4 py-4 sm:px-6 hover:bg-red-health-50 transition-colors duration-150">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-2 font-medium text-red-500">{allocation.id}</div>
                  <div className="col-span-3 font-medium">₹{allocation.assignedDiscount.toLocaleString()}</div>
                  <div className="col-span-7 text-gray-700">{allocation.justification}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-red-500">JSON Output</h3>
        <div className="mt-2 bg-white rounded-md p-4 overflow-auto shadow-md border border-red-health-300">
          <pre className="text-sm text-black">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
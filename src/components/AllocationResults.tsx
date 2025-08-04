'use client';

import { DiscountOutput } from '@/types';

interface AllocationResultsProps {
  results: DiscountOutput | null;
}

export default function AllocationResults({ results }: AllocationResultsProps) {
  if (!results) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-red-health-800">Allocation Results</h2>

      <div className="overflow-hidden bg-white shadow-lg rounded-lg border border-red-health-100">
        <div className="px-4 py-5 sm:px-6 bg-red-health-50">
          <h3 className="text-lg font-medium leading-6 text-red-health-800">Summary</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Total allocated: <span className="font-medium text-red-health-700">₹{results.summary?.totalAllocated.toLocaleString()}</span>
          </p>
          {results.summary?.remainingKitty !== 0 && (
            <p className="mt-1 max-w-2xl text-sm text-gray-600">
              Remaining kitty: <span className="font-medium text-red-health-700">₹{results.summary?.remainingKitty.toLocaleString()}</span>
            </p>
          )}
        </div>

        <div className="border-t border-red-health-100">
          <div className="bg-red-health-50 px-4 py-3 sm:px-6">
            <div className="grid grid-cols-12 gap-4 font-medium text-sm text-gray-600">
              <div className="col-span-2">Agent ID</div>
              <div className="col-span-3">Allocation</div>
              <div className="col-span-7">Justification</div>
            </div>
          </div>
          <ul className="divide-y divide-red-health-100">
            {results.allocations.map((allocation) => (
              <li key={allocation.id} className="px-4 py-4 sm:px-6 hover:bg-red-health-50 transition-colors duration-150">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-2 font-medium text-red-health-600">{allocation.id}</div>
                  <div className="col-span-3 font-medium">₹{allocation.assignedDiscount.toLocaleString()}</div>
                  <div className="col-span-7 text-gray-700">{allocation.justification}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-red-health-800">JSON Output</h3>
        <div className="mt-2 bg-red-health-800 rounded-md p-4 overflow-auto shadow-md">
          <pre className="text-sm text-white">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
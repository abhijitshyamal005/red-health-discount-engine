'use client';

import { useState, useEffect } from 'react';
import { DiscountInput, SalesAgent, DiscountSituation } from '@/types';

interface AllocationFormProps {
  onSubmit: (input: DiscountInput) => void;
  isLoading: boolean;
}

const DEFAULT_AGENT: SalesAgent = {
  id: '',
  performanceScore: 0,
  seniorityMonths: 0,
  targetAchievedPercent: 0,
  activeClients: 0,
};

// Situation descriptions for tooltips
const SITUATION_DESCRIPTIONS = {
  standard: 'Regular discount allocation based on agent performance metrics',
  seasonal: 'Special seasonal promotions with higher emphasis on recent performance',
  newProduct: 'New product launch with focus on experienced agents',
  competitiveResponse: 'Response to competitor actions with emphasis on target achievement',
  customerRetention: 'Focus on retaining existing customers with emphasis on active clients',
};

// Predefined weights for different situations
const SITUATION_WEIGHTS = {
  standard: {
    performanceScore: 0.35,
    seniorityMonths: 0.25,
    targetAchievedPercent: 0.25,
    activeClients: 0.15,
  },
  seasonal: {
    performanceScore: 0.50,
    seniorityMonths: 0.10,
    targetAchievedPercent: 0.30,
    activeClients: 0.10,
  },
  newProduct: {
    performanceScore: 0.30,
    seniorityMonths: 0.45,
    targetAchievedPercent: 0.15,
    activeClients: 0.10,
  },
  competitiveResponse: {
    performanceScore: 0.25,
    seniorityMonths: 0.15,
    targetAchievedPercent: 0.45,
    activeClients: 0.15,
  },
  customerRetention: {
    performanceScore: 0.20,
    seniorityMonths: 0.20,
    targetAchievedPercent: 0.20,
    activeClients: 0.40,
  },
};

export default function AllocationForm({ onSubmit, isLoading }: AllocationFormProps) {
  const [siteKitty, setSiteKitty] = useState<number>(10000);
  const [agents, setAgents] = useState<SalesAgent[]>([{ ...DEFAULT_AGENT, id: 'A1' }]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minPerAgent, setMinPerAgent] = useState<number | undefined>();
  const [maxPerAgent, setMaxPerAgent] = useState<number | undefined>();
  const [weights, setWeights] = useState(SITUATION_WEIGHTS.standard);
  const [situation, setSituation] = useState<DiscountSituation>('standard');
  // Add state for current JSON data
  const [currentJsonData, setCurrentJsonData] = useState<DiscountInput | null>(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);

  // Update weights when situation changes
  useEffect(() => {
    setWeights(SITUATION_WEIGHTS[situation]);
  }, [situation]);

  // Update JSON data whenever form data changes
  useEffect(() => {
    const jsonData: DiscountInput = {
      siteKitty,
      salesAgents: agents,
      situation,
      config: {
        ...(minPerAgent !== undefined && { minPerAgent }),
        ...(maxPerAgent !== undefined && { maxPerAgent }),
        weights,
      },
    };
    setCurrentJsonData(jsonData);
  }, [siteKitty, agents, minPerAgent, maxPerAgent, weights, situation]);

  const handleAgentChange = (index: number, field: keyof SalesAgent, value: string | number) => {
    const newAgents = [...agents];
    newAgents[index] = {
      ...newAgents[index],
      [field]: typeof value === 'string' ? value : Number(value),
    };
    setAgents(newAgents);
  };

  const addAgent = () => {
    setAgents([...agents, { ...DEFAULT_AGENT, id: `A${agents.length + 1}` }]);
  };

  const removeAgent = (index: number) => {
    if (agents.length > 1) {
      const newAgents = [...agents];
      newAgents.splice(index, 1);
      setAgents(newAgents);
    }
  };

  const handleWeightChange = (field: keyof typeof weights, value: number) => {
    setWeights({
      ...weights,
      [field]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare input data
    const input: DiscountInput = {
      siteKitty,
      salesAgents: agents,
      situation,
      config: {
        ...(minPerAgent !== undefined && { minPerAgent }),
        ...(maxPerAgent !== undefined && { maxPerAgent }),
        weights,
      },
    };
    
    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Discount Kitty</h2>
        <div>
          <label htmlFor="siteKitty" className="block text-sm font-medium text-gray-700">
            Total Amount (₹)
          </label>
          <input
            type="number"
            id="siteKitty"
            value={siteKitty}
            onChange={(e) => setSiteKitty(Number(e.target.value))}
            min="1"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Discount Situation Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Discount Situation</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <label htmlFor="situation" className="block text-sm font-medium text-gray-700 mb-2">
            Select the business context for this discount allocation
          </label>
          <select
            id="situation"
            value={situation}
            onChange={(e) => setSituation(e.target.value as DiscountSituation)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
          >
            {Object.entries(SITUATION_DESCRIPTIONS).map(([key, description]) => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)} - {description}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            {SITUATION_DESCRIPTIONS[situation]}
          </p>
        </div>
      </div>

      {/* Rest of the form remains the same */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Sales Agents</h2>
          <button
            type="button"
            onClick={addAgent}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-health-500"
          >
            Add Agent
          </button>
        </div>

        {/* Agent form fields remain the same */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          {agents.map((agent, index) => (
            <div key={agent.id} className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Agent {index + 1}</h3>
                {agents.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAgent(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`agent-${agent.id}-id`} className="block text-sm font-medium text-gray-700">
                    ID
                  </label>
                  <input
                    type="text"
                    id={`agent-${index}-id`}
                    value={agent.id}
                    onChange={(e) => handleAgentChange(index, 'id', e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                  />
                </div>
                
                {/* Other agent fields remain the same */}
                <div>
                  <label htmlFor={`agent-${index}-performance`} className="block text-sm font-medium text-gray-700">
                    Performance Score (0-100)
                  </label>
                  <input
                    type="number"
                    id={`agent-${index}-performance`}
                    value={agent.performanceScore}
                    onChange={(e) => handleAgentChange(index, 'performanceScore', Number(e.target.value))}
                    min="0"
                    max="100"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor={`agent-${index}-seniority`} className="block text-sm font-medium text-gray-700">
                    Seniority (months)
                  </label>
                  <input
                    type="number"
                    id={`agent-${index}-seniority`}
                    value={agent.seniorityMonths}
                    onChange={(e) => handleAgentChange(index, 'seniorityMonths', Number(e.target.value))}
                    min="0"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor={`agent-${index}-target`} className="block text-sm font-medium text-gray-700">
                    Target Achieved (%)
                  </label>
                  <input
                    type="number"
                    id={`agent-${index}-target`}
                    value={agent.targetAchievedPercent}
                    onChange={(e) => handleAgentChange(index, 'targetAchievedPercent', Number(e.target.value))}
                    min="0"
                    max="100"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor={`agent-${index}-clients`} className="block text-sm font-medium text-gray-700">
                    Active Clients
                  </label>
                  <input
                    type="number"
                    id={`agent-${index}-clients`}
                    value={agent.activeClients}
                    onChange={(e) => handleAgentChange(index, 'activeClients', Number(e.target.value))}
                    min="0"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-red-health-600 hover:text-red-health-800 text-sm font-medium"
        >
          {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 bg-red-health-50 p-4 rounded-lg border border-red-health-100">
            <h3 className="text-lg font-medium">Advanced Configuration</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="minPerAgent" className="block text-sm font-medium text-gray-700">
                  Minimum Per Agent (₹)
                </label>
                <input
                  type="number"
                  id="minPerAgent"
                  value={minPerAgent || ''}
                  onChange={(e) => setMinPerAgent(e.target.value ? Number(e.target.value) : undefined)}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                />
              </div>

              <div>
                <label htmlFor="maxPerAgent" className="block text-sm font-medium text-gray-700">
                  Maximum Per Agent (₹)
                </label>
                <input
                  type="number"
                  id="maxPerAgent"
                  value={maxPerAgent || ''}
                  onChange={(e) => setMaxPerAgent(e.target.value ? Number(e.target.value) : undefined)}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="text-md font-medium">Metric Weights</h4>
                <button 
                  type="button"
                  onClick={() => setWeights(SITUATION_WEIGHTS[situation])}
                  className="text-xs text-red-health-600 hover:text-red-health-800"
                >
                  Reset to {situation} defaults
                </button>
              </div>
              <p className="text-sm text-gray-500">Adjust the importance of each metric (total must equal 1)</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight-performance" className="block text-sm font-medium text-gray-700">
                    Performance Score
                  </label>
                  <input
                    type="number"
                    id="weight-performance"
                    value={weights.performanceScore}
                    onChange={(e) => handleWeightChange('performanceScore', Number(e.target.value))}
                    step="0.05"
                    min="0"
                    max="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="weight-seniority" className="block text-sm font-medium text-gray-700">
                    Seniority
                  </label>
                  <input
                    type="number"
                    id="weight-seniority"
                    value={weights.seniorityMonths}
                    onChange={(e) => handleWeightChange('seniorityMonths', Number(e.target.value))}
                    step="0.05"
                    min="0"
                    max="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="weight-target" className="block text-sm font-medium text-gray-700">
                    Target Achievement
                  </label>
                  <input
                    type="number"
                    id="weight-target"
                    value={weights.targetAchievedPercent}
                    onChange={(e) => handleWeightChange('targetAchievedPercent', Number(e.target.value))}
                    step="0.05"
                    min="0"
                    max="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="weight-clients" className="block text-sm font-medium text-gray-700">
                    Active Clients
                  </label>
                  <input
                    type="number"
                    id="weight-clients"
                    value={weights.activeClients}
                    onChange={(e) => handleWeightChange('activeClients', Number(e.target.value))}
                    step="0.05"
                    min="0"
                    max="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-health-500 focus:ring-red-health-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="text-sm">
                Total weight: {Object.values(weights).reduce((sum, weight) => sum + weight, 0).toFixed(2)}
                {Math.abs(Object.values(weights).reduce((sum, weight) => sum + weight, 0) - 1) > 0.01 && (
                  <span className="text-red-500 ml-2">(Should equal 1)</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-health-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-health-500 disabled:bg-red-health-300"
        >
          {isLoading ? 'Calculating...' : 'Calculate Allocation'}
        </button>
      </div>

      {/* JSON Preview Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowJsonPreview(!showJsonPreview)}
          className="text-red-health-600 hover:text-red-health-800 text-sm font-medium"
        >
          {showJsonPreview ? 'Hide JSON Preview' : 'Show JSON Preview'}
        </button>

        {showJsonPreview && currentJsonData && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-lg font-medium mb-2">Current Form Data (JSON)</h3>
            <div className="bg-white rounded-md p-4 overflow-auto shadow-sm border border-gray-300">
              <pre className="text-sm text-gray-800">
                {JSON.stringify(currentJsonData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

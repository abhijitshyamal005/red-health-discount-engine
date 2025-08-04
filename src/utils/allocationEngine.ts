import { DiscountInput, DiscountOutput, SalesAgent, AgentAllocation } from '../types';

// Default weights for different metrics
const DEFAULT_WEIGHTS = {
  performanceScore: 0.35,
  seniorityMonths: 0.25,
  targetAchievedPercent: 0.25,
  activeClients: 0.15,
};

/**
 * Normalizes a value within a range of values
 * @param value The value to normalize
 * @param min The minimum value in the range
 * @param max The maximum value in the range
 * @returns A normalized value between 0 and 1
 */
const normalize = (value: number, min: number, max: number): number => {
  // If min and max are the same, return 1 (all values are equal)
  if (min === max) return 1;
  return (value - min) / (max - min);
};

/**
 * Calculates a weighted score for an agent based on their metrics
 * @param agent The sales agent
 * @param agents All sales agents (used for normalization)
 * @param weights The weights to apply to different metrics
 * @returns A score between 0 and 1
 */
const calculateAgentScore = (
  agent: SalesAgent,
  agents: SalesAgent[],
  weights = DEFAULT_WEIGHTS
): number => {
  // Find min and max values for each metric across all agents
  const metrics = {
    performanceScore: {
      min: Math.min(...agents.map(a => a.performanceScore)),
      max: Math.max(...agents.map(a => a.performanceScore)),
    },
    seniorityMonths: {
      min: Math.min(...agents.map(a => a.seniorityMonths)),
      max: Math.max(...agents.map(a => a.seniorityMonths)),
    },
    targetAchievedPercent: {
      min: Math.min(...agents.map(a => a.targetAchievedPercent)),
      max: Math.max(...agents.map(a => a.targetAchievedPercent)),
    },
    activeClients: {
      min: Math.min(...agents.map(a => a.activeClients)),
      max: Math.max(...agents.map(a => a.activeClients)),
    },
  };

  // Calculate normalized scores for each metric
  const normalizedScores = {
    performanceScore: normalize(
      agent.performanceScore,
      metrics.performanceScore.min,
      metrics.performanceScore.max
    ),
    seniorityMonths: normalize(
      agent.seniorityMonths,
      metrics.seniorityMonths.min,
      metrics.seniorityMonths.max
    ),
    targetAchievedPercent: normalize(
      agent.targetAchievedPercent,
      metrics.targetAchievedPercent.min,
      metrics.targetAchievedPercent.max
    ),
    activeClients: normalize(
      agent.activeClients,
      metrics.activeClients.min,
      metrics.activeClients.max
    ),
  };

  // Calculate weighted score
  return (
    normalizedScores.performanceScore * weights.performanceScore +
    normalizedScores.seniorityMonths * weights.seniorityMonths +
    normalizedScores.targetAchievedPercent * weights.targetAchievedPercent +
    normalizedScores.activeClients * weights.activeClients
  );
};

/**
 * Generates a justification message for an agent's allocation
 * @param agent The sales agent
 * @param score The agent's calculated score
 * @param agents All sales agents
 * @returns A justification string
 */
const generateJustification = (
  agent: SalesAgent,
  score: number,
  agents: SalesAgent[]
): string => {
  const strengths: string[] = [];
  const areas: string[] = [];

  // Performance score
  const avgPerformance = agents.reduce((sum, a) => sum + a.performanceScore, 0) / agents.length;
  if (agent.performanceScore > avgPerformance * 1.1) {
    strengths.push('high performance');
  } else if (agent.performanceScore < avgPerformance * 0.9) {
    areas.push('performance');
  }

  // Seniority
  const avgSeniority = agents.reduce((sum, a) => sum + a.seniorityMonths, 0) / agents.length;
  if (agent.seniorityMonths > avgSeniority * 1.2) {
    strengths.push('long-term contribution');
  }

  // Target achievement
  const avgTarget = agents.reduce((sum, a) => sum + a.targetAchievedPercent, 0) / agents.length;
  if (agent.targetAchievedPercent > avgTarget * 1.1) {
    strengths.push('consistent target achievement');
  } else if (agent.targetAchievedPercent < avgTarget * 0.9) {
    areas.push('target achievement');
  }

  // Active clients
  const avgClients = agents.reduce((sum, a) => sum + a.activeClients, 0) / agents.length;
  if (agent.activeClients > avgClients * 1.1) {
    strengths.push('managing many active clients');
  }

  // Generate justification based on strengths and areas for improvement
  if (strengths.length > 0) {
    return `Recognized for ${strengths.join(' and ')}${areas.length > 0 ? ' with potential for growth in ' + areas.join(' and ') : ''}`;
  } else if (areas.length > 0) {
    return `Moderate overall contribution with opportunity to improve ${areas.join(' and ')}`;
  } else {
    return 'Balanced contribution across all performance metrics';
  }
};

/**
 * Allocates discounts to sales agents based on their performance metrics
 * @param input The discount allocation input
 * @returns The discount allocation output
 */
export const allocateDiscounts = (input: DiscountInput): DiscountOutput => {
  const { siteKitty, salesAgents, config = {} } = input;
  
  // Use provided weights or defaults
  const weights = {
    ...DEFAULT_WEIGHTS,
    ...config.weights,
  };

  // Calculate scores for each agent
  const agentScores = salesAgents.map(agent => ({
    agent,
    score: calculateAgentScore(agent, salesAgents, weights),
  }));

  // Calculate total score
  const totalScore = agentScores.reduce((sum, item) => sum + item.score, 0);

  // Initial allocation based on scores
 const  allocations: AgentAllocation[] = agentScores.map(({ agent, score }) => {
    // Calculate raw allocation based on score proportion
    let rawAllocation = (score / totalScore) * siteKitty;
    
    // Apply min/max constraints if provided
    if (config.minPerAgent !== undefined) {
      rawAllocation = Math.max(rawAllocation, config.minPerAgent);
    }
    if (config.maxPerAgent !== undefined) {
      rawAllocation = Math.min(rawAllocation, config.maxPerAgent);
    }
    
    // Round to nearest integer
    const assignedDiscount = Math.round(rawAllocation);
    
    return {
      id: agent.id,
      assignedDiscount,
      justification: generateJustification(agent, score, salesAgents),
    };
  });

  // Calculate total allocated and adjust if necessary to match kitty
  let totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.assignedDiscount, 0);
  
  // Handle rounding discrepancies
  if (totalAllocated !== siteKitty) {
    const diff = siteKitty - totalAllocated;
    
    if (diff > 0) {
      // Need to allocate more - give to highest performers first
      const sortedByScore = [...agentScores]
        .sort((a, b) => b.score - a.score)
        .map(item => item.agent.id);
      
      let remaining = diff;
      let index = 0;
      
      while (remaining > 0 && index < sortedByScore.length) {
        const agentId = sortedByScore[index];
        const allocation = allocations.find(a => a.id === agentId)!;
        
        // Check if adding to this agent would exceed max
        if (config.maxPerAgent === undefined || allocation.assignedDiscount < config.maxPerAgent) {
          allocation.assignedDiscount += 1;
          remaining -= 1;
        }
        
        index = (index + 1) % sortedByScore.length;
      }
    } else if (diff < 0) {
      // Need to reduce - take from lowest performers first
      const sortedByScore = [...agentScores]
        .sort((a, b) => a.score - b.score)
        .map(item => item.agent.id);
      
      let remaining = -diff;
      let index = 0;
      
      while (remaining > 0 && index < sortedByScore.length) {
        const agentId = sortedByScore[index];
        const allocation = allocations.find(a => a.id === agentId)!;
        
        // Check if reducing this agent would go below min
        if (config.minPerAgent === undefined || allocation.assignedDiscount > config.minPerAgent) {
          allocation.assignedDiscount -= 1;
          remaining -= 1;
        }
        
        index = (index + 1) % sortedByScore.length;
      }
    }
    
    // Recalculate total after adjustments
    totalAllocated = allocations.reduce((sum, alloc) => sum + alloc.assignedDiscount, 0);
  }

  return {
    allocations,
    summary: {
      totalAllocated,
      remainingKitty: siteKitty - totalAllocated,
    },
  };
};
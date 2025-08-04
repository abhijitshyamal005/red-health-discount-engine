// Define the types for our application

// Input types
export interface SalesAgent {
  id: string;
  performanceScore: number;
  seniorityMonths: number;
  targetAchievedPercent: number;
  activeClients: number;
}

export interface DiscountInput {
  siteKitty: number;
  salesAgents: SalesAgent[];
  config?: {
    minPerAgent?: number;
    maxPerAgent?: number;
    weights?: {
      performanceScore?: number;
      seniorityMonths?: number;
      targetAchievedPercent?: number;
      activeClients?: number;
    };
  };
}

// Output types
export interface AgentAllocation {
  id: string;
  assignedDiscount: number;
  justification: string;
}

export interface DiscountOutput {
  allocations: AgentAllocation[];
  summary?: {
    totalAllocated: number;
    remainingKitty: number;
  };
}
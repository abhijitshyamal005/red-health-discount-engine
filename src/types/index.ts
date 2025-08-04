// Define the types for our application

// Input types
export interface SalesAgent {
  id: string;
  performanceScore: number;
  seniorityMonths: number;
  targetAchievedPercent: number;
  activeClients: number;
}

// Define different discount situations
export type DiscountSituation = 'standard' | 'seasonal' | 'newProduct' | 'competitiveResponse' | 'customerRetention';

export interface DiscountInput {
  siteKitty: number;
  salesAgents: SalesAgent[];
  situation?: DiscountSituation; // New field for situation-based discounts
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
  situation?: DiscountSituation; // Include the situation in output
  summary?: {
    totalAllocated: number;
    remainingKitty: number;
  };
}
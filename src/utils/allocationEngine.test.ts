import { allocateDiscounts } from './allocationEngine';
import { DiscountInput } from '../types';

describe('Discount Allocation Engine', () => {
  // Test Case 1: Normal case with different agent metrics
  test('should allocate discounts proportionally based on agent metrics', () => {
    const input: DiscountInput = {
      siteKitty: 10000,
      salesAgents: [
        {
          id: 'A1',
          performanceScore: 90,
          seniorityMonths: 18,
          targetAchievedPercent: 85,
          activeClients: 12,
        },
        {
          id: 'A2',
          performanceScore: 70,
          seniorityMonths: 6,
          targetAchievedPercent: 60,
          activeClients: 8,
        },
      ],
    };

    const result = allocateDiscounts(input);

    // Verify total allocation matches kitty
    expect(result.summary?.totalAllocated).toBe(10000);
    expect(result.summary?.remainingKitty).toBe(0);

    // Verify higher performing agent gets more
    const a1Allocation = result.allocations.find(a => a.id === 'A1');
    const a2Allocation = result.allocations.find(a => a.id === 'A2');
    expect(a1Allocation?.assignedDiscount).toBeGreaterThan(a2Allocation?.assignedDiscount || 0);

    // Verify justifications are provided
    expect(a1Allocation?.justification).toBeTruthy();
    expect(a2Allocation?.justification).toBeTruthy();
  });

  // Test Case 2: All agents have identical metrics
  test('should allocate discounts equally when all agents have identical metrics', () => {
    const input: DiscountInput = {
      siteKitty: 9000,
      salesAgents: [
        {
          id: 'A1',
          performanceScore: 80,
          seniorityMonths: 12,
          targetAchievedPercent: 75,
          activeClients: 10,
        },
        {
          id: 'A2',
          performanceScore: 80,
          seniorityMonths: 12,
          targetAchievedPercent: 75,
          activeClients: 10,
        },
        {
          id: 'A3',
          performanceScore: 80,
          seniorityMonths: 12,
          targetAchievedPercent: 75,
          activeClients: 10,
        },
      ],
    };

    const result = allocateDiscounts(input);

    // Verify total allocation matches kitty
    expect(result.summary?.totalAllocated).toBe(9000);
    expect(result.summary?.remainingKitty).toBe(0);

    // Verify all agents get equal allocation
    const allocations = result.allocations.map(a => a.assignedDiscount);
    expect(allocations[0]).toBe(allocations[1]);
    expect(allocations[1]).toBe(allocations[2]);
    expect(allocations[0]).toBe(3000); // 9000 / 3 = 3000
  });

  // Test Case 3: Rounding edge case
  test('should handle rounding correctly and adjust to match kitty exactly', () => {
    const input: DiscountInput = {
      siteKitty: 10001, // Odd number that won't divide evenly
      salesAgents: [
        {
          id: 'A1',
          performanceScore: 85,
          seniorityMonths: 15,
          targetAchievedPercent: 80,
          activeClients: 11,
        },
        {
          id: 'A2',
          performanceScore: 75,
          seniorityMonths: 10,
          targetAchievedPercent: 70,
          activeClients: 9,
        },
        {
          id: 'A3',
          performanceScore: 65,
          seniorityMonths: 5,
          targetAchievedPercent: 60,
          activeClients: 7,
        },
      ],
    };

    const result = allocateDiscounts(input);

    // Verify total allocation matches kitty exactly
    expect(result.summary?.totalAllocated).toBe(10001);
    expect(result.summary?.remainingKitty).toBe(0);

    // Verify the sum of all allocations equals the kitty
    const totalAllocated = result.allocations.reduce(
      (sum, alloc) => sum + alloc.assignedDiscount,
      0
    );
    expect(totalAllocated).toBe(10001);
  });

  // Test Case 4: Min/Max constraints
  test('should respect min and max constraints', () => {
    const input: DiscountInput = {
      siteKitty: 10000,
      salesAgents: [
        {
          id: 'A1',
          performanceScore: 95,
          seniorityMonths: 24,
          targetAchievedPercent: 90,
          activeClients: 15,
        },
        {
          id: 'A2',
          performanceScore: 50,
          seniorityMonths: 3,
          targetAchievedPercent: 40,
          activeClients: 4,
        },
      ],
      config: {
        minPerAgent: 2000,
        maxPerAgent: 8000,
      },
    };

    const result = allocateDiscounts(input);

    // Verify total allocation matches kitty
    expect(result.summary?.totalAllocated).toBe(10000);

    // Verify min/max constraints are respected
    result.allocations.forEach(allocation => {
      expect(allocation.assignedDiscount).toBeGreaterThanOrEqual(2000);
      expect(allocation.assignedDiscount).toBeLessThanOrEqual(8000);
    });
  });
});
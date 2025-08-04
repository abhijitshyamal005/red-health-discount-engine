import { NextRequest, NextResponse } from 'next/server';
import { allocateDiscounts } from '@/utils/allocationEngine';
import { DiscountInput } from '@/types';

/**
 * API endpoint to handle discount allocation requests
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate input
    if (!body.siteKitty || !body.salesAgents || !Array.isArray(body.salesAgents)) {
      return NextResponse.json(
        { error: 'Invalid input. Required fields: siteKitty, salesAgents (array)' },
        { status: 400 }
      );
    }
    
    // Validate that siteKitty is a positive number
    if (typeof body.siteKitty !== 'number' || body.siteKitty <= 0) {
      return NextResponse.json(
        { error: 'siteKitty must be a positive number' },
        { status: 400 }
      );
    }
    
    // Validate that salesAgents is not empty
    if (body.salesAgents.length === 0) {
      return NextResponse.json(
        { error: 'salesAgents array cannot be empty' },
        { status: 400 }
      );
    }
    
    // Validate each sales agent has required fields
    for (const agent of body.salesAgents) {
      if (
        !agent.id ||
        typeof agent.performanceScore !== 'number' ||
        typeof agent.seniorityMonths !== 'number' ||
        typeof agent.targetAchievedPercent !== 'number' ||
        typeof agent.activeClients !== 'number'
      ) {
        return NextResponse.json(
          { 
            error: 'Each sales agent must have id, performanceScore, seniorityMonths, targetAchievedPercent, and activeClients fields' 
          },
          { status: 400 }
        );
      }
    }
    
    // Process the allocation
    const input: DiscountInput = body;
    const result = allocateDiscounts(input);
    
    // Return the result
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing discount allocation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
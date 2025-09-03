import { JoyApiClient } from '../client';
import { Program, SuccessResponse } from '../types';

export interface ProgramEligibilityParams {
  shopifyCustomerId?: string;
  customerId?: string;
}

export interface CalculatePointsParams {
  products: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
  shopifyCustomerId?: string;
  sourceName?: string;
}

export interface SocialInteractionParams {
  shopifyCustomerId: string;
  event?: string;
  earningId?: string;
}

export interface RedeemParams {
  programId: string;
  shopifyCustomerId: string;
  quantity?: number;
}

export class Programs {
  constructor(private client: JoyApiClient) {}

  async getEarningPrograms(): Promise<SuccessResponse<Program[]>> {
    return this.client.get('/rest_api/v2/programs/earning');
  }

  async getEarningProgramsEligibility(
    params: ProgramEligibilityParams
  ): Promise<SuccessResponse<Program[]>> {
    return this.client.get('/rest_api/v2/programs/earning/eligibility', params);
  }

  async calculateEarningPoints(
    params: CalculatePointsParams
  ): Promise<SuccessResponse<{
    pointsEarn: number;
    products: any[];
  }>> {
    return this.client.post('/rest_api/v2/programs/earning/points/calculate', params);
  }

  async handleSocialInteraction(
    params: SocialInteractionParams
  ): Promise<SuccessResponse<any>> {
    return this.client.post('/rest_api/v2/programs/earning/social/interactions', params);
  }

  async getRedemptionPrograms(params?: {
    shopifyCustomerId?: string;
    event?: 'amount_discount' | 'percentage_discount' | 'free_shipping' | 'free_gift';
  }): Promise<SuccessResponse<Program[]>> {
    return this.client.get('/rest_api/v2/programs/redemption', params);
  }

  async getProgram(
    programId: string,
    params?: { shopifyCustomerId?: string }
  ): Promise<SuccessResponse<Program>> {
    return this.client.get(`/rest_api/v2/programs/${programId}`, params);
  }

  async redeem(params: RedeemParams): Promise<SuccessResponse<any>> {
    return this.client.post('/rest_api/v2/programs/redemption/redeem', params);
  }
}
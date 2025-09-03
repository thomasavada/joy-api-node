import { JoyApiClient } from '../client';
import { SuccessResponse } from '../types';

export interface RedeemParams {
  programId: string;
  customerId?: string;
  shopifyCustomerId?: string;
  locale?: string;
  redeemPoint?: number;
  source?: string;
}

export class Redemption {
  constructor(private client: JoyApiClient) {}

  async redeem(params: RedeemParams): Promise<SuccessResponse<{
    success: boolean;
    message: string;
    reward?: any;
  }>> {
    return this.client.post('/rest_api/v2/redeem', {
      ...params,
      source: params.source || 'rest_api'
    });
  }
}
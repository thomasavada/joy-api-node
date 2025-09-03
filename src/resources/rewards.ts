import { JoyApiClient } from '../client';
import { Reward, SuccessResponse, PaginationParams, DateRangeParams } from '../types';

export interface RewardListParams extends PaginationParams, DateRangeParams {
  customerId?: string;
  shopifyCustomerId?: string;
  status?: 'active' | 'used' | 'expired';
  typeReward?: string;
  order?: 'createdAt_desc' | 'createdAt_asc' | 'updatedAt_desc' | 'updatedAt_asc';
}

export interface CouponRefundParams {
  discountCode: string;
  shopifyCustomerId: string;
  reason?: string;
}

export class Rewards {
  constructor(private client: JoyApiClient) {}

  async list(params: RewardListParams): Promise<SuccessResponse<Reward[]>> {
    if (!params.customerId && !params.shopifyCustomerId) {
      throw new Error('Either customerId or shopifyCustomerId is required');
    }
    return this.client.get('/rest_api/v2/rewards', params);
  }

  async get(rewardId: string): Promise<SuccessResponse<Reward>> {
    return this.client.get(`/rest_api/v2/rewards/${rewardId}`);
  }

  async refundCoupon(params: CouponRefundParams): Promise<SuccessResponse<{
    success: boolean;
    message: string;
  }>> {
    return this.client.post('/rest_api/v2/rewards/coupons/refund', params);
  }
}
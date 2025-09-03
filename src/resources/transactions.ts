import { JoyApiClient } from '../client';
import { Activity, SuccessResponse, PaginationParams, DateRangeParams } from '../types';

export interface TransactionListParams extends PaginationParams, DateRangeParams {
  shopifyCustomerId?: string;
  customerId?: string;
  type?: 'earn_point' | 'redeem_point' | 'adjust_point';
  event?: string;
  source?: 'admin' | 'user' | 'rest_api' | 'webhook';
  order?: 'createdAt_desc' | 'createdAt_asc';
}

export interface PointsParams {
  shopifyCustomerId: string;
  point: number;
  adminNote?: string;
  userNote?: string;
  reason?: string;
}

export class Transactions {
  constructor(private client: JoyApiClient) {}

  async list(params?: TransactionListParams): Promise<SuccessResponse<Activity[]>> {
    return this.client.get('/rest_api/v2/transactions', params);
  }

  async get(transactionId: string): Promise<SuccessResponse<Activity>> {
    return this.client.get(`/rest_api/v2/transactions/${transactionId}`);
  }

  async awardPoints(params: PointsParams): Promise<SuccessResponse<any>> {
    return this.client.post('/rest_api/v2/transactions/points/award', params);
  }

  async deductPoints(params: PointsParams): Promise<SuccessResponse<any>> {
    return this.client.post('/rest_api/v2/transactions/points/deduct', params);
  }

  async adjustPoints(params: PointsParams): Promise<SuccessResponse<any>> {
    return this.client.post('/rest_api/v2/transactions/points/adjust', params);
  }

  async resetPoints(params: PointsParams): Promise<SuccessResponse<any>> {
    return this.client.post('/rest_api/v2/transactions/points/reset', params);
  }
}
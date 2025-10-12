import { JoyApiClient } from '../client';
import { Customer, SuccessResponse, PaginationParams, DateRangeParams } from '../types';

export interface CustomerListParams extends PaginationParams, DateRangeParams {
  email?: string;
  type?: 'member' | 'guest' | 'left';
  tierId?: string;
  order?: 'createdAt_desc' | 'createdAt_asc' | 'updatedAt_desc' | 'updatedAt_asc' | 'point_desc' | 'point_asc';
}

export interface CustomerUpdateParams {
  dateOfBirth?: string;
  birthday?: string;
}

export interface TierUpdateParams {
  tierId: string;
  isInitTier?: boolean;
  triggerReward?: boolean;
  adminNote?: string;
}

export class Customers {
  constructor(private client: JoyApiClient) {}

  async list(params?: CustomerListParams): Promise<SuccessResponse<Customer[]>> {
    return this.client.get('/rest_api/v2/customers', params);
  }

  async get(customerId: string): Promise<SuccessResponse<Customer>> {
    return this.client.get(`/rest_api/v2/customers/${customerId}`);
  }

  async update(
    customerId: string,
    data: CustomerUpdateParams
  ): Promise<SuccessResponse<{ id: string; shopifyCustomerId: string }>> {
    return this.client.put(`/rest_api/v2/customers/${customerId}`, data);
  }

  /**
   * @deprecated Use getByShopifyId() instead. This method will be removed in a future version.
   */
  async getByExternalId(externalId: string): Promise<SuccessResponse<Customer>> {
    return this.getByShopifyId(externalId);
  }

  async getByShopifyId(shopifyCustomerId: string): Promise<SuccessResponse<Customer>> {
    return this.client.get(`/rest_api/v2/customers/external/${shopifyCustomerId}`);
  }

  async updateByShopifyId(
    shopifyCustomerId: string,
    data: CustomerUpdateParams
  ): Promise<SuccessResponse<{ id: string; shopifyCustomerId: string }>> {
    return this.client.put(`/rest_api/v2/customers/external/${shopifyCustomerId}`, data);
  }

  async getEarnedPoints(
    customerId: string
  ): Promise<SuccessResponse<{ totalEarnedPoints: number }>> {
    return this.client.get(`/rest_api/v2/customers/${customerId}/points/earned`);
  }

  async updateTier(
    customerId: string,
    data: TierUpdateParams
  ): Promise<SuccessResponse<{
    id: string;
    shopifyCustomerId: string;
    tierId: string;
    tierName: string;
    tierPoint: number;
    tierUpdatedAt: string;
  }>> {
    return this.client.put(`/rest_api/v2/customers/${customerId}/tier`, data);
  }

  async updateTierByShopifyId(
    shopifyCustomerId: string,
    data: TierUpdateParams
  ): Promise<SuccessResponse<{
    id: string;
    shopifyCustomerId: string;
    tierId: string;
    tierName: string;
    tierPoint: number;
    tierUpdatedAt: string;
  }>> {
    return this.client.put(`/rest_api/v2/customers/external/${shopifyCustomerId}/tier`, data);
  }
}
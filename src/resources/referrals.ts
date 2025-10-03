import { JoyApiClient } from '../client';
import { SuccessResponse } from '../types';

export interface InvitationParams {
  email: string;
}

export interface ReferralAnalyticsParams {
  startDate?: string;
  endDate?: string;
}

export class Referrals {
  constructor(private client: JoyApiClient) {}

  async createInvitation(params: InvitationParams): Promise<SuccessResponse<{
    inviteLink: string;
    referralCode: string;
  }>> {
    return this.client.post('/rest_api/v2/referrals/invitations', params);
  }

  async getReferrers(customerId: string): Promise<SuccessResponse<any[]>> {
    return this.client.get(`/rest_api/v2/referrals/customers/${customerId}/referrers`);
  }

  async getSummary(customerId: string): Promise<SuccessResponse<{
    totalReferrals: number;
    totalPointsEarned: number;
    totalVouchersEarned: number;
  }>> {
    return this.client.get(`/rest_api/v2/referrals/customers/${customerId}/summary`);
  }

  async getAnalytics(params?: ReferralAnalyticsParams): Promise<SuccessResponse<{
    totalConversions: number;
  }>> {
    return this.client.get('/rest_api/v2/referrals/analytics', params);
  }
}
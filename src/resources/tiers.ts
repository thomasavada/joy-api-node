import { JoyApiClient } from '../client';
import { Tier, Program, SuccessResponse } from '../types';

export class Tiers {
  constructor(private client: JoyApiClient) {}

  async list(): Promise<SuccessResponse<Tier[]>> {
    return this.client.get('/rest_api/v2/tiers');
  }

  async get(tierId: string): Promise<SuccessResponse<Tier>> {
    return this.client.get(`/rest_api/v2/tiers/${tierId}`);
  }

  async getRewardsByType(benefitType: string): Promise<SuccessResponse<Program[]>> {
    return this.client.get(`/rest_api/v2/tiers/benefits/${benefitType}`);
  }
}
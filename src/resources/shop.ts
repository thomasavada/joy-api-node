import { JoyApiClient } from '../client';
import { Shop, SuccessResponse } from '../types';

export class ShopResource {
  constructor(private client: JoyApiClient) {}

  async whoami(): Promise<SuccessResponse<Shop>> {
    return this.client.get('/rest_api/v2/whoami');
  }
}
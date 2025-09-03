import { JoyApiClient } from './client';
import { JoyApiOptions } from './types';
import { Programs } from './resources/programs';
import { Customers } from './resources/customers';
import { Transactions } from './resources/transactions';
import { Rewards } from './resources/rewards';
import { Tiers } from './resources/tiers';
import { Referrals } from './resources/referrals';
import { ShopResource } from './resources/shop';
import { Redemption } from './resources/redemption';

export class JoyApi {
  private client: JoyApiClient;
  
  public programs: Programs;
  public customers: Customers;
  public transactions: Transactions;
  public rewards: Rewards;
  public tiers: Tiers;
  public referrals: Referrals;
  public shop: ShopResource;
  public redemption: Redemption;

  constructor(options: JoyApiOptions) {
    if (!options.appKey) {
      throw new Error('appKey is required');
    }
    if (!options.secretKey) {
      throw new Error('secretKey is required');
    }

    this.client = new JoyApiClient(options);
    
    this.programs = new Programs(this.client);
    this.customers = new Customers(this.client);
    this.transactions = new Transactions(this.client);
    this.rewards = new Rewards(this.client);
    this.tiers = new Tiers(this.client);
    this.referrals = new Referrals(this.client);
    this.shop = new ShopResource(this.client);
    this.redemption = new Redemption(this.client);
  }

  getClient(): JoyApiClient {
    return this.client;
  }
}
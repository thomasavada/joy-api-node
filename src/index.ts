export { JoyApi } from './joy-api';
export { JoyApiClient } from './client';
export { JoyApiError } from './errors';

export * from './types';

export { Programs } from './resources/programs';
export { Customers } from './resources/customers';
export { Transactions } from './resources/transactions';
export { Rewards } from './resources/rewards';
export { Tiers } from './resources/tiers';
export { Referrals } from './resources/referrals';
export { ShopResource } from './resources/shop';
export { Redemption } from './resources/redemption';

import { JoyApi } from './joy-api';
export default JoyApi;
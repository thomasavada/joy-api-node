# Joy API Node

A TypeScript/Node.js client library for the Joy Loyalty Program REST API v2.

## Installation

```bash
npm install joy-api-node
```

## Quick Start

```typescript
import JoyApi from 'joy-api-node';

const joy = new JoyApi({
  appKey: 'your-app-key',
  secretKey: 'your-secret-key',
  baseUrl: 'https://dev-api.joy.so', // optional, defaults to production
  timeout: 30000, // optional, request timeout in ms
  maxRetries: 3 // optional, number of retries for failed requests
});
```

## Usage Examples

### Shop Information

```typescript
// Get shop information
const shop = await joy.shop.whoami();
console.log(shop.data);
```

### Customer Management

```typescript
// List customers with pagination
const customers = await joy.customers.list({
  limit: 20,
  type: 'member',
  order: 'createdAt_desc'
});

// Get customer by ID
const customer = await joy.customers.get('customer-id');

// Get customer by Shopify ID
const customer = await joy.customers.getByShopifyId('7891234567890');

// Update customer
await joy.customers.update('customer-id', {
  dateOfBirth: '1990-05-15',
  birthday: '05/15'
});

// Update customer tier
await joy.customers.updateTier('customer-id', {
  tierId: 'tier-id',
  triggerReward: true
});
```

### Programs

```typescript
// Get earning programs
const earningPrograms = await joy.programs.getEarningPrograms();

// Get redemption programs
const redemptionPrograms = await joy.programs.getRedemptionPrograms({
  event: 'amount_discount'
});

// Calculate earning points
const calculation = await joy.programs.calculateEarningPoints({
  products: [
    { id: 'product-1', quantity: 2, price: 50.00 }
  ],
  shopifyCustomerId: '7891234567890'
});

// Redeem points
await joy.programs.redeem({
  programId: 'program-id',
  shopifyCustomerId: '7891234567890',
  quantity: 1
});
```

### Transactions & Points

```typescript
// List transactions
const transactions = await joy.transactions.list({
  shopifyCustomerId: '7891234567890',
  type: 'earn_point',
  limit: 10
});

// Award points
await joy.transactions.awardPoints({
  shopifyCustomerId: '7891234567890',
  point: 100,
  adminNote: 'Bonus points',
  userNote: 'Thank you for your loyalty!'
});

// Deduct points
await joy.transactions.deductPoints({
  shopifyCustomerId: '7891234567890',
  point: 50,
  reason: 'Point adjustment'
});

// Adjust points (can be positive or negative)
await joy.transactions.adjustPoints({
  shopifyCustomerId: '7891234567890',
  point: -25,
  reason: 'Balance correction'
});

// Reset points
await joy.transactions.resetPoints({
  shopifyCustomerId: '7891234567890',
  point: 0,
  reason: 'Program reset'
});
```

### Rewards

```typescript
// List customer rewards
const rewards = await joy.rewards.list({
  shopifyCustomerId: '7891234567890',
  status: 'active',
  limit: 10
});

// Get reward details
const reward = await joy.rewards.get('reward-id');

// Refund coupon
await joy.rewards.refundCoupon({
  discountCode: 'JOY-ABC123',
  shopifyCustomerId: '7891234567890',
  reason: 'Customer request'
});
```

### Tiers

```typescript
// List all tiers
const tiers = await joy.tiers.list();

// Get tier details
const tier = await joy.tiers.get('tier-id');

// Get tier rewards by type
const tierRewards = await joy.tiers.getRewardsByType('discount');
```

### Referrals

```typescript
// Create referral invitation
const invitation = await joy.referrals.createInvitation({
  email: 'customer@example.com'
});

// Get referral summary
const summary = await joy.referrals.getSummary('customer-id');

// Get referral analytics
const analytics = await joy.referrals.getAnalytics({
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

### Simple Redemption

```typescript
// Redeem points for rewards
const redemption = await joy.redemption.redeem({
  programId: 'program-id',
  shopifyCustomerId: '7891234567890',
  redeemPoint: 100
});
```

## Error Handling

```typescript
import { JoyApiError } from 'joy-api-node';

try {
  const customer = await joy.customers.get('invalid-id');
} catch (error) {
  if (error instanceof JoyApiError) {
    console.error('API Error:', error.message);
    console.error('Status Code:', error.statusCode);
    console.error('Error Code:', error.code);
    console.error('Details:', error.details);
  }
}
```

## Pagination

Most list endpoints support cursor-based pagination:

```typescript
// First page
const firstPage = await joy.customers.list({ limit: 20 });

// Get next page using the last item's ID
if (firstPage.meta?.pagination?.hasNext) {
  const lastCustomerId = firstPage.data[firstPage.data.length - 1].id;
  const nextPage = await joy.customers.list({ 
    limit: 20, 
    after: lastCustomerId 
  });
}

// Get previous page using the first item's ID
if (firstPage.meta?.pagination?.hasPre) {
  const firstCustomerId = firstPage.data[0].id;
  const prevPage = await joy.customers.list({ 
    limit: 20, 
    before: firstCustomerId 
  });
}

// Include total count (may increase response time)
const withCount = await joy.customers.list({ 
  limit: 20, 
  hasCount: true 
});
console.log('Total customers:', withCount.meta?.pagination?.total);
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions:

```typescript
import { Customer, Program, Activity, Reward, Tier } from 'joy-api-node';

const processCustomer = (customer: Customer) => {
  console.log(`Customer ${customer.email} has ${customer.point} points`);
};

const processProgram = (program: Program) => {
  if (program.type === 'earning') {
    console.log(`Earn ${program.earnPoint} points`);
  }
};
```

## API Documentation

For detailed API documentation, please refer to the [Joy Loyalty Program API Documentation](https://docs.joy.so).

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on GitHub.

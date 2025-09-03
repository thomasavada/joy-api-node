const JoyApi = require('../dist/index').default;

describe('Rewards API', () => {
  let joy;

  beforeAll(() => {
    joy = new JoyApi({
      appKey: global.testConfig.appKey,
      secretKey: global.testConfig.secretKey,
      baseUrl: global.testConfig.baseUrl,
      timeout: 30000,
      maxRetries: 3
    });
  });

  describe('List Rewards', () => {
    test('should get customer rewards by Shopify ID', async () => {
      const response = await joy.rewards.list({
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        limit: 10
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.meta).toBeDefined();
      expect(response.meta.pagination).toBeDefined();

      if (response.data.length > 0) {
        const reward = response.data[0];
        expect(reward.id).toBeDefined();
        expect(reward.customerId).toBeDefined();
        expect(reward.email).toBeDefined();
        expect(reward.couponCode).toBeDefined();
        expect(reward.programTitle).toBeDefined();
        expect(reward.discountStatus).toMatch(/^(active|used|expired)$/);
      }
    });

    test('should get customer rewards by internal customer ID', async () => {
      const response = await joy.rewards.list({
        customerId: global.testConfig.testCustomer.id,
        limit: 10
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
    });

    test('should filter rewards by status', async () => {
      const response = await joy.rewards.list({
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        status: 'active',
        limit: 5
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);

      response.data.forEach(reward => {
        expect(reward.discountStatus).toBe('active');
      });
    });

    test('should sort rewards by creation date', async () => {
      const response = await joy.rewards.list({
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        order: 'createdAt_desc',
        limit: 5
      });

      expect(response.success).toBe(true);
      
      if (response.data.length >= 2) {
        const date1 = new Date(response.data[0].createdAt);
        const date2 = new Date(response.data[1].createdAt);
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
      }
    });

    test('should require customer identifier', async () => {
      try {
        await joy.rewards.list({
          limit: 5
        });
        fail('Should throw error when no customer ID provided');
      } catch (error) {
        expect(error.message).toContain('Either customerId or shopifyCustomerId is required');
      }
    });
  });

  describe('Get Reward', () => {
    test('should get reward by ID', async () => {
      // First get a reward ID
      const listResponse = await joy.rewards.list({
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        limit: 1
      });
      
      if (listResponse.data.length > 0) {
        const rewardId = listResponse.data[0].id;
        const response = await joy.rewards.get(rewardId);

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBe(rewardId);
        expect(response.data.couponCode).toBeDefined();
        expect(response.data.programTitle).toBeDefined();
      } else {
        console.log('⊘ Skipped: No rewards available for testing');
      }
    });
  });

  describe('Coupon Operations', () => {
    test('should handle coupon refund', async () => {
      // First try to get an active reward
      const rewardsResponse = await joy.rewards.list({
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        status: 'active',
        limit: 1
      });

      if (rewardsResponse.data.length > 0) {
        const reward = rewardsResponse.data[0];
        
        try {
          const response = await joy.rewards.refundCoupon({
            discountCode: reward.couponCode,
            shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
            reason: 'Jest test refund'
          });

          expect(response.success).toBe(true);
          expect(response.data.success).toBe(true);
          expect(response.data.message).toBeDefined();
        } catch (error) {
          // Expected to fail if coupon is already used or doesn't exist
          expect([400, 404]).toContain(error.statusCode);
        }
      } else {
        console.log('⊘ Skipped: No active rewards available for refund testing');
      }
    });

    test('should handle invalid coupon refund', async () => {
      try {
        await joy.rewards.refundCoupon({
          discountCode: 'INVALID-COUPON-CODE',
          shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
          reason: 'Jest test invalid refund'
        });
        fail('Should throw error for invalid coupon');
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });
  });
});
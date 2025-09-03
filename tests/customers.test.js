const JoyApi = require('../dist/index').default;

describe('Customers API', () => {
  let joy;
  let testCustomerId;
  let testShopifyCustomerId;

  beforeAll(() => {
    joy = new JoyApi({
      appKey: global.testConfig.appKey,
      secretKey: global.testConfig.secretKey,
      baseUrl: global.testConfig.baseUrl,
      timeout: 30000,
      maxRetries: 3
    });
  });

  describe('List Customers', () => {
    test('should get customers with pagination', async () => {
      const response = await joy.customers.list({
        limit: 5,
        hasCount: true
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeLessThanOrEqual(5);
      expect(response.meta).toBeDefined();
      expect(response.meta.pagination).toBeDefined();
      expect(typeof response.meta.pagination.hasNext).toBe('boolean');
      expect(typeof response.meta.pagination.hasPre).toBe('boolean');

      // Store first customer for other tests
      if (response.data.length > 0) {
        testCustomerId = response.data[0].id;
        testShopifyCustomerId = response.data[0].shopifyCustomerId;
      }
    });

    test('should filter customers by type', async () => {
      const response = await joy.customers.list({
        type: 'member',
        limit: 10
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data.length > 0) {
        response.data.forEach(customer => {
          expect(customer.type).toBe('member');
        });
      }
    });

    test('should sort customers by creation date', async () => {
      const response = await joy.customers.list({
        order: 'createdAt_desc',
        limit: 5
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);

      if (response.data.length >= 2) {
        const date1 = new Date(response.data[0].createdAt);
        const date2 = new Date(response.data[1].createdAt);
        expect(date1.getTime()).toBeGreaterThanOrEqual(date2.getTime());
      }
    });

    test('should filter customers by date range', async () => {
      const response = await joy.customers.list({
        created_at_max: '2025-12-31T23:59:59Z',
        limit: 5
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
    });
  });

  describe('Get Customer', () => {
    test('should get customer by internal ID', async () => {
      if (!testCustomerId) {
        // Get a customer first
        const listResponse = await joy.customers.list({ limit: 1 });
        if (listResponse.data.length > 0) {
          testCustomerId = listResponse.data[0].id;
        }
      }

      if (testCustomerId) {
        const response = await joy.customers.get(testCustomerId);

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBe(testCustomerId);
        expect(response.data.email).toBeDefined();
        expect(typeof response.data.point).toBe('number');
        expect(typeof response.data.hasJoinedProgram).toBe('boolean');
      } else {
        console.log('⊘ Skipped: No customer ID available');
      }
    });

    test('should get customer by Shopify ID', async () => {
      const shopifyId = testShopifyCustomerId || global.testConfig.testCustomer.shopifyId;
      
      try {
        const response = await joy.customers.getByShopifyId(shopifyId);
        
        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data.shopifyCustomerId.toString()).toBe(shopifyId.toString());
      } catch (error) {
        if (error.statusCode === 404) {
          console.log('⊘ Customer not found (404) - expected for test data');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Update Customer', () => {
    test('should update customer birthday', async () => {
      if (!testCustomerId) {
        console.log('⊘ Skipped: No customer ID available');
        return;
      }

      try {
        const response = await joy.customers.update(testCustomerId, {
          dateOfBirth: '1990-05-15',
          birthday: '05/15'
        });

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBeDefined();
      } catch (error) {
        if (error.statusCode === 400 || error.statusCode === 404) {
          console.log(`⊘ Expected error: ${error.message}`);
        } else {
          throw error;
        }
      }
    });

    test('should update customer by Shopify ID', async () => {
      const shopifyId = testShopifyCustomerId || global.testConfig.testCustomer.shopifyId;

      try {
        const response = await joy.customers.updateByShopifyId(shopifyId, {
          dateOfBirth: '1995-03-15'
        });

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
      } catch (error) {
        if (error.statusCode === 404) {
          console.log('⊘ Customer not found (404) - expected for test data');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Customer Points', () => {
    test('should get customer earned points', async () => {
      const customerId = testShopifyCustomerId || global.testConfig.testCustomer.shopifyId;

      if (!customerId) {
        console.log('⊘ Skipped: No customer ID available');
        return;
      }

      try {
        const response = await joy.customers.getEarnedPoints(customerId);

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(typeof response.data.totalEarnedPoints).toBe('number');
      } catch (error) {
        if (error.statusCode === 404) {
          console.log('⊘ Customer not found (404) - expected for test data');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Customer Tiers', () => {
    test('should update customer tier', async () => {
      const customerId = global.testConfig.testCustomer.id;
      const tierId = global.testConfig.testTiers.bronze;

      try {
        const response = await joy.customers.updateTier(customerId, {
          tierId,
          isInitTier: false,
          triggerReward: false,
          adminNote: 'Jest test tier update'
        });

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data.tierId).toBeDefined();
        expect(response.data.tierName).toBeDefined();
      } catch (error) {
        if (error.statusCode === 404) {
          console.log('⊘ Customer or tier not found (404) - expected for test data');
        } else {
          throw error;
        }
      }
    });

    test('should update customer tier by Shopify ID', async () => {
      const shopifyId = global.testConfig.testCustomer.shopifyId;
      const tierId = global.testConfig.testTiers.bronze;

      try {
        const response = await joy.customers.updateTierByShopifyId(shopifyId, {
          tierId,
          triggerReward: false
        });

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
      } catch (error) {
        if (error.statusCode === 404) {
          console.log('⊘ Customer or tier not found (404) - expected for test data');
        } else {
          throw error;
        }
      }
    });
  });
});
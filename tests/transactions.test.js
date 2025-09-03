const JoyApi = require('../dist/index').default;

describe('Transactions API', () => {
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

  describe('List Transactions', () => {
    test('should get transactions with pagination', async () => {
      const response = await joy.transactions.list({
        limit: 10,
        hasCount: true
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.data.length).toBeLessThanOrEqual(10);
      expect(response.meta).toBeDefined();
      expect(response.meta.pagination).toBeDefined();
    });

    test('should filter transactions by customer', async () => {
      const response = await joy.transactions.list({
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        limit: 5
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);

      response.data.forEach(transaction => {
        expect(transaction.shopifyCustomerId.toString()).toBe(
          global.testConfig.testCustomer.shopifyId.toString()
        );
      });
    });

    test('should filter transactions by type', async () => {
      const response = await joy.transactions.list({
        type: 'earn_point',
        limit: 5
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);

      response.data.forEach(transaction => {
        expect(transaction.type).toContain('earn');
      });
    });

    test('should sort transactions by creation date', async () => {
      const response = await joy.transactions.list({
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
  });

  describe('Point Operations', () => {
    test('should award points to customer', async () => {
      const pointsData = {
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        point: 10,
        adminNote: 'Jest test award',
        userNote: 'Test bonus points',
        reason: 'test_award'
      };

      try {
        const response = await joy.transactions.awardPoints(pointsData);
        expect(response.success).toBe(true);
      } catch (error) {
        if (error.statusCode === 404) {
          console.log('⊘ Customer not found (404) - expected for test data');
        } else {
          throw error;
        }
      }
    });

    test('should deduct points from customer', async () => {
      const pointsData = {
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        point: 5,
        adminNote: 'Jest test deduction',
        userNote: 'Test point deduction',
        reason: 'test_deduction'
      };

      try {
        const response = await joy.transactions.deductPoints(pointsData);
        expect(response.success).toBe(true);
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 400) {
          console.log(`⊘ Expected error: ${error.message}`);
        } else {
          throw error;
        }
      }
    });

    test('should adjust customer points', async () => {
      const adjustData = {
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        point: -3,
        adminNote: 'Jest test adjustment',
        userNote: 'Balance correction',
        reason: 'test_adjustment'
      };

      try {
        const response = await joy.transactions.adjustPoints(adjustData);
        expect(response.success).toBe(true);
      } catch (error) {
        if (error.statusCode === 404 || error.statusCode === 400) {
          console.log(`⊘ Expected error: ${error.message}`);
        } else {
          throw error;
        }
      }
    });

    test('should reset customer points', async () => {
      const resetData = {
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        point: 100,
        adminNote: 'Jest test reset',
        userNote: 'Points reset for testing',
        reason: 'test_reset'
      };

      try {
        const response = await joy.transactions.resetPoints(resetData);
        expect(response.success).toBe(true);
      } catch (error) {
        if (error.statusCode === 404) {
          console.log('⊘ Customer not found (404) - expected for test data');
        } else {
          throw error;
        }
      }
    });
  });

  describe('Get Transaction', () => {
    test('should get transaction by ID', async () => {
      // First get a transaction ID
      const listResponse = await joy.transactions.list({ limit: 1 });
      
      if (listResponse.data.length > 0) {
        const transactionId = listResponse.data[0].id;
        const response = await joy.transactions.get(transactionId);

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBe(transactionId);
        expect(response.data.type).toBeDefined();
        expect(response.data.createdAt).toBeDefined();
      } else {
        console.log('⊘ Skipped: No transactions available');
      }
    });
  });
});
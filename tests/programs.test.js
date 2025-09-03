const JoyApi = require('../dist/index').default;

describe('Programs API', () => {
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

  describe('Earning Programs', () => {
    test('should get all earning programs', async () => {
      const response = await joy.programs.getEarningPrograms();

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.meta).toBeDefined();
      expect(typeof response.meta.count).toBe('number');

      if (response.data.length > 0) {
        const program = response.data[0];
        expect(program.id).toBeDefined();
        expect(program.title).toBeDefined();
        expect(program.type).toBe('earning');
        expect(typeof program.status).toBe('boolean');
      }
    });

    test('should get earning programs for customer eligibility', async () => {
      const response = await joy.programs.getEarningProgramsEligibility({
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);

      // Check for isEarned field on single-earn programs
      response.data.forEach(program => {
        expect(program.id).toBeDefined();
        expect(program.type).toBe('earning');
        if (['sign_up', 'follow_instagram', 'birthday'].includes(program.event)) {
          expect(typeof program.isEarned).toBe('boolean');
        }
      });
    });

    test('should calculate earning points', async () => {
      const response = await joy.programs.calculateEarningPoints({
        products: [
          { id: 'product-1', quantity: 2, price: 50.00 },
          { id: 'product-2', quantity: 1, price: 25.00 }
        ],
        shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
        sourceName: 'web'
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(typeof response.data.pointsEarn).toBe('number');
      expect(Array.isArray(response.data.products)).toBe(true);
    });

    test('should handle social interactions', async () => {
      try {
        const response = await joy.programs.handleSocialInteraction({
          shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
          event: 'follow_instagram'
        });

        expect(response.success).toBe(true);
      } catch (error) {
        // Expected to fail if customer already earned or program doesn't exist
        expect([400, 404]).toContain(error.statusCode);
      }
    });
  });

  describe('Redemption Programs', () => {
    test('should get all redemption programs', async () => {
      const response = await joy.programs.getRedemptionPrograms();

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);

      if (response.data.length > 0) {
        const program = response.data[0];
        expect(program.id).toBeDefined();
        expect(program.title).toBeDefined();
        expect(program.type).toBe('spending');
        expect(typeof program.status).toBe('boolean');
        expect(typeof program.spendPoint).toBe('number');
      }
    });

    test('should filter redemption programs by event type', async () => {
      const response = await joy.programs.getRedemptionPrograms({
        event: 'amount_discount'
      });

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);

      response.data.forEach(program => {
        expect(program.event).toBe('amount_discount');
      });
    });

    test('should get specific program by ID', async () => {
      // First get a program ID
      const listResponse = await joy.programs.getRedemptionPrograms();
      
      if (listResponse.data.length > 0) {
        const programId = listResponse.data[0].id;
        const response = await joy.programs.getProgram(programId);

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBe(programId);
        expect(response.data.title).toBeDefined();
      }
    });

    test('should redeem points through program', async () => {
      try {
        // Get a redemption program first
        const programsResponse = await joy.programs.getRedemptionPrograms();
        
        if (programsResponse.data.length > 0) {
          const programId = programsResponse.data[0].id;
          
          const response = await joy.programs.redeem({
            programId,
            shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
            quantity: 1
          });

          expect(response.success).toBe(true);
        }
      } catch (error) {
        // Expected to fail if insufficient points or invalid customer
        expect([400, 404]).toContain(error.statusCode);
      }
    });
  });
});
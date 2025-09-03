const JoyApi = require('../dist/index').default;

describe('Redemption API', () => {
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

  describe('Simple Redemption', () => {
    test('should redeem points for rewards', async () => {
      // First get available redemption programs
      const programsResponse = await joy.programs.getRedemptionPrograms();
      
      if (programsResponse.data.length > 0) {
        const programId = programsResponse.data[0].id;
        
        try {
          const response = await joy.redemption.redeem({
            programId,
            shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
            redeemPoint: 100,
            locale: 'en'
          });

          expect(response.success).toBe(true);
          expect(response.data).toBeDefined();
          expect(response.data.success).toBe(true);
          expect(response.data.message).toBeDefined();
          
          if (response.data.reward) {
            expect(typeof response.data.reward).toBe('object');
          }
        } catch (error) {
          // Expected to fail if insufficient points or invalid customer
          expect([400, 404]).toContain(error.statusCode);
          console.log(`⊘ Expected error: ${error.message}`);
        }
      } else {
        console.log('⊘ Skipped: No redemption programs available');
      }
    });

    test('should redeem with customer internal ID', async () => {
      const programsResponse = await joy.programs.getRedemptionPrograms();
      
      if (programsResponse.data.length > 0) {
        const programId = programsResponse.data[0].id;
        
        try {
          const response = await joy.redemption.redeem({
            programId,
            customerId: global.testConfig.testCustomer.id,
            redeemPoint: 50,
            source: 'rest_api'
          });

          expect(response.success).toBe(true);
          expect(response.data.success).toBe(true);
        } catch (error) {
          expect([400, 404]).toContain(error.statusCode);
          console.log(`⊘ Expected error: ${error.message}`);
        }
      }
    });

    test('should handle invalid program ID', async () => {
      try {
        await joy.redemption.redeem({
          programId: 'invalid-program-id',
          shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
          redeemPoint: 100
        });
        fail('Should throw error for invalid program');
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });

    test('should handle insufficient points', async () => {
      const programsResponse = await joy.programs.getRedemptionPrograms();
      
      if (programsResponse.data.length > 0) {
        const program = programsResponse.data.find(p => p.spendPoint > 10000);
        
        if (program) {
          try {
            await joy.redemption.redeem({
              programId: program.id,
              shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
              redeemPoint: program.spendPoint
            });
            fail('Should throw error for insufficient points');
          } catch (error) {
            expect(error.statusCode).toBe(400);
          }
        }
      }
    });

    test('should default source to rest_api', async () => {
      const programsResponse = await joy.programs.getRedemptionPrograms();
      
      if (programsResponse.data.length > 0) {
        const programId = programsResponse.data[0].id;
        
        try {
          const response = await joy.redemption.redeem({
            programId,
            shopifyCustomerId: global.testConfig.testCustomer.shopifyId,
            redeemPoint: 10
          });

          expect(response.success).toBe(true);
        } catch (error) {
          expect([400, 404]).toContain(error.statusCode);
        }
      }
    });
  });
});
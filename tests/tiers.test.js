const JoyApi = require('../dist/index').default;

describe('Tiers API', () => {
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

  describe('List Tiers', () => {
    test('should get all tiers', async () => {
      const response = await joy.tiers.list();

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.meta).toBeDefined();
      expect(typeof response.meta.count).toBe('number');

      if (response.data.length > 0) {
        const tier = response.data[0];
        expect(tier.id).toBeDefined();
        expect(tier.name).toBeDefined();
        expect(typeof tier.targetPoint).toBe('number');
        expect(typeof tier.members).toBe('number');
        expect(tier.createdAt).toBeDefined();
        expect(tier.updatedAt).toBeDefined();
      }
    });

    test('should have valid tier structure', async () => {
      const response = await joy.tiers.list();

      response.data.forEach(tier => {
        expect(tier.id).toBeDefined();
        expect(tier.name).toBeDefined();
        expect(typeof tier.targetPoint).toBe('number');
        expect(typeof tier.inactive === 'undefined' || typeof tier.inactive === 'boolean').toBe(true);
        
        if (tier.tierRewards) {
          expect(Array.isArray(tier.tierRewards)).toBe(true);
          tier.tierRewards.forEach(reward => {
            expect(reward.id).toBeDefined();
            expect(typeof reward.status).toBe('boolean');
            expect(reward.title).toBeDefined();
          });
        }
      });
    });
  });

  describe('Get Tier', () => {
    test('should get tier by ID', async () => {
      // First get a tier ID
      const listResponse = await joy.tiers.list();
      
      if (listResponse.data.length > 0) {
        const tierId = listResponse.data[0].id;
        const response = await joy.tiers.get(tierId);

        expect(response.success).toBe(true);
        expect(response.data).toBeDefined();
        expect(response.data.id).toBe(tierId);
        expect(response.data.name).toBeDefined();
        expect(typeof response.data.targetPoint).toBe('number');
        
        if (response.data.tierRewards) {
          expect(Array.isArray(response.data.tierRewards)).toBe(true);
        }
      } else {
        console.log('⊘ Skipped: No tiers available for testing');
      }
    });

    test('should handle non-existent tier', async () => {
      try {
        await joy.tiers.get('non-existent-tier-id');
        fail('Should throw error for non-existent tier');
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe('Tier Rewards', () => {
    test('should get tier rewards by benefit type', async () => {
      try {
        const response = await joy.tiers.getRewardsByType('discount');

        expect(response.success).toBe(true);
        expect(Array.isArray(response.data)).toBe(true);
        expect(response.meta).toBeDefined();
        
        response.data.forEach(reward => {
          expect(reward.id).toBeDefined();
          expect(reward.title).toBeDefined();
        });
      } catch (error) {
        // May not have rewards of this type
        if (error.statusCode === 404) {
          console.log('⊘ No rewards found for benefit type');
        } else {
          throw error;
        }
      }
    });

    test('should handle invalid benefit type', async () => {
      try {
        await joy.tiers.getRewardsByType('invalid-benefit-type');
      } catch (error) {
        expect([400, 404]).toContain(error.statusCode);
      }
    });
  });
});
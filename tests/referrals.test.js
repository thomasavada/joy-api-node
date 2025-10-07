const JoyApi = require('../dist/index').default;

describe('Referrals API', () => {
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

  describe('Referral Invitations', () => {
    test('should create referral invitation', async () => {
      const response = await joy.referrals.createInvitation({
        email: 'test@example.com'
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.inviteLink).toBeDefined();
      expect(response.data.referralCode).toBeDefined();
      expect(typeof response.data.inviteLink).toBe('string');
      expect(typeof response.data.referralCode).toBe('string');
      expect(response.data.inviteLink).toMatch(/^https?:\/\//);
    });

    test('should validate email format', async () => {
      try {
        await joy.referrals.createInvitation({
          email: 'invalid-email'
        });
        fail('Should throw error for invalid email');
      } catch (error) {
        expect(error.statusCode).toBe(400);
      }
    });
  });

  describe('Customer Referrals', () => {
    test('should get customer referrers', async () => {
      const response = await joy.referrals.getReferrers(global.testConfig.testCustomer.id);

      expect(response.success).toBe(true);
      expect(Array.isArray(response.data)).toBe(true);
      expect(response.meta).toBeDefined();
      expect(typeof response.meta.count).toBe('number');

      // Each referrer should have basic structure
      response.data.forEach(referrer => {
        expect(typeof referrer).toBe('object');
      });
    });

    test('should get customer referral summary', async () => {
      const response = await joy.referrals.getSummary(global.testConfig.testCustomer.id);

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(typeof response.data.totalRedeemCoupon).toBe('number');
      expect(typeof response.data.totalRedeemCoupon).toBe('number');

      // All values should be non-negative
      expect(response.data.totalRedeemCoupon).toBeGreaterThanOrEqual(0);
      expect(response.data.totalPointEarnRefer).toBeGreaterThanOrEqual(0);
    });

    test('should handle non-existent customer', async () => {
      try {
        await joy.referrals.getSummary('non-existent-customer-id');
        fail('Should throw error for non-existent customer');
      } catch (error) {
        expect(error.statusCode).toBe(404);
      }
    });
  });

  describe('Referral Analytics', () => {
    test('should get referral analytics', async () => {
      const response = await joy.referrals.getAnalytics();

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(typeof response.data.countCouponCodeUsage).toBe('number');

      // All values should be non-negative
      expect(response.data.countCouponCodeUsage).toBeGreaterThanOrEqual(0);
    });

    test('should get referral analytics with date range', async () => {
      const response = await joy.referrals.getAnalytics({
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      });

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(typeof response.data.countCouponCodeUsage).toBe('number');
    });

    test('should validate date format', async () => {
      try {
        await joy.referrals.getAnalytics({
          startDate: 'invalid-date',
          endDate: '2024-12-31'
        });
      } catch (error) {
        expect([400, 422]).toContain(error.statusCode);
      }
    });
  });
});
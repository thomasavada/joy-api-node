const JoyApi = require('../dist/index').default;

describe('Shop API', () => {
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

  describe('Shop Information', () => {
    test('should get shop information', async () => {
      const response = await joy.shop.whoami();

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.name).toBeDefined();
      expect(response.data.domain).toBeDefined();
      expect(response.data.email).toBeDefined();
      expect(response.data.plan).toBeDefined();
      expect(response.data.currency).toBeDefined();
      expect(response.data.timezone).toBeDefined();
      expect(response.data.countryCode).toBeDefined();
      expect(typeof response.data.isInstalled).toBe('boolean');
      expect(response.data.createdAt).toBeDefined();
      expect(response.data.updatedAt).toBeDefined();
    });

    test('should return valid shop data structure', async () => {
      const response = await joy.shop.whoami();
      const shop = response.data;

      // Validate required fields
      expect(typeof shop.id).toBe('string');
      expect(typeof shop.name).toBe('string');
      expect(typeof shop.domain).toBe('string');
      expect(typeof shop.email).toBe('string');
      expect(typeof shop.plan).toBe('string');
      expect(typeof shop.currency).toBe('string');
      expect(typeof shop.isInstalled).toBe('boolean');

      // Validate date formats
      expect(new Date(shop.createdAt).toString()).not.toBe('Invalid Date');
      expect(new Date(shop.updatedAt).toString()).not.toBe('Invalid Date');

      // Check if domain looks valid
      expect(shop.domain).toMatch(/\./);
      
      // Check if email looks valid
      expect(shop.email).toMatch(/@/);
    });

    test('should have consistent response format', async () => {
      const response = await joy.shop.whoami();

      expect(response.success).toBe(true);
      expect(response.data).toBeDefined();
      expect(response.timestamp).toBeDefined();
      expect(new Date(response.timestamp).toString()).not.toBe('Invalid Date');
    });
  });
});
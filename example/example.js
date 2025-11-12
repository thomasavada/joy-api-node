const JoyApi = require('joy-api-node');

(async () => {
  try {
    const joy = new JoyApi({
      appKey: 'KPojcrw58u8T1C69ZBls',
      secretKey: '4c5a9d436cefce67248247e53d4240f0',
      baseUrl: 'https://dev-api.joy.so', // optional, defaults to production
      timeout: 30000, // optional, request timeout in ms
      maxRetries: 3 // optional, number of retries for failed requests
    });

// Get shop information
    const shop = await joy.shop.whoami();
    console.log(shop.data);
  } catch (e) {
    console.error(e)
  }
})()


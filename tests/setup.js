require('dotenv').config();

global.testConfig = {
  appKey: process.env.JOY_APP_KEY || 'F8FcHd8bc03qDKPRrYYd',
  secretKey: process.env.JOY_SECRET_KEY || 'fdf3f26ba11bc9fa062ac02152a697b1',
  baseUrl: process.env.JOY_BASE_URL || 'https://avada-joy-staging.firebaseapp.com',
  testCustomer: {
    id: process.env.TEST_CUSTOMER_ID || 'XLacU68YKR5tC3moGqUP',
    shopifyId: process.env.TEST_SHOPIFY_CUSTOMER_ID || '8720295559390',
    email: process.env.TEST_CUSTOMER_EMAIL || 'anhnt@avada.io'
  },
  testTiers: {
    bronze: process.env.TEST_BRONZE_TIER_ID || '1Fe1kqHZbE7Alx1GmFEC',
    vipPro: process.env.TEST_VIP_TIER_ID || '0cd20cc6-1cac-40fe-b350-49deca03470d'
  },
  testPrograms: {
    discount: process.env.TEST_DISCOUNT_PROGRAM_ID || 'vIswMZYogmKyw94GzEvn',
    freeGift: process.env.TEST_FREE_GIFT_PROGRAM_ID || 'aYorhxYUTkUKIDZgL1R5'
  }
};
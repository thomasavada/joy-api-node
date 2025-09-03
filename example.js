const JoyApi = require('./dist/index').default;

// Initialize the Joy API client
const joy = new JoyApi({
  appKey: 'F8FcHd8bc03qDKPRrYYd',
  secretKey: 'fdf3f26ba11bc9fa062ac02152a697b1',
  baseUrl: 'https://avada-joy-staging.firebaseapp.com',
  timeout: 30000,
  maxRetries: 3
});

async function main() {
  try {
    // Example 1: Get shop information
    console.log('Getting shop information...');
    const shopInfo = await joy.shop.whoami();
    console.log('Shop:', shopInfo.data);
    // Example 2: List customers
    console.log('\nListing customers...');
    const customers = await joy.customers.list({
      limit: 5,
      type: 'member',
    });
    console.log(`Found ${customers.data.length} customers`, customers);

    // Example 3: Award points to a customer
    // const shopifyCustomerId = '7891234567890';
    // console.log('\nAwarding points...');
    // await joy.transactions.awardPoints({
    //   shopifyCustomerId,
    //   point: 100,
    //   adminNote: 'Welcome bonus',
    //   userNote: 'Thank you for joining our loyalty program!'
    // });
    // console.log('Points awarded successfully');
    //
    // // Example 4: Get earning programs
    // console.log('\nGetting earning programs...');
    // const earningPrograms = await joy.programs.getEarningPrograms();
    // console.log(`Found ${earningPrograms.data.length} earning programs`);
    //
    // // Example 5: Get customer rewards
    // console.log('\nGetting customer rewards...');
    // const rewards = await joy.rewards.list({
    //   shopifyCustomerId,
    //   status: 'active'
    // });
    // console.log(`Customer has ${rewards.data.length} active rewards`);
    //
    // // Example 6: Get all tiers
    // console.log('\nGetting tiers...');
    // const tiers = await joy.tiers.list();
    // console.log(`Found ${tiers.data.length} tiers`);
    // tiers.data.forEach(tier => {
    //   console.log(`  - ${tier.name}: ${tier.targetPoint} points required`);
    // });

  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the examples
main();

import Stripe from 'stripe';

// || '' -> for TypeScript -> prevent error message
const stripeConfig = new Stripe(process.env.STRIPE_SECRET || '', {
  apiVersion: '2020-08-27',
});

export default stripeConfig;

export const formatAmountForStripe = (amount, currency) => {
  return amount * 100;
};

export const formatAmountFromStripe = (amount, currency) => {
  return amount / 100;
};

export const SUBSCRIPTION_PLANS = {
  monthly: {
    name: 'Monthly Plan',
    price: 999,
    interval: 'month',
    description: 'Billed monthly'
  },
  yearly: {
    name: 'Yearly Plan', 
    price: 9999,
    interval: 'year',
    description: 'Billed yearly (2 months free)'
  }
};

export const ONE_TIME_PLANS = {
  basic: {
    name: 'Basic Report',
    price: 1999,
    description: 'One-time vehicle history report'
  },
  premium: {
    name: 'Premium Report',
    price: 4999,
    description: 'Comprehensive vehicle history report'
  }
};
const required = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const bankUser = {
  email: required('BANK_EMAIL'),
  password: required('BANK_PASSWORD')
};

export const shopUser = {
  email: process.env.SHOP_EMAIL || bankUser.email,
  password: process.env.SHOP_PASSWORD || bankUser.password
};

export const bankUsers = [
  { ...bankUser, expectSuccess: true },
  { email: 'invalid-user@example.com', password: 'Invalid-Password-123!', expectSuccess: false }
];

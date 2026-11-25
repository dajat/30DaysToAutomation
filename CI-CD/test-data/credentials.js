export const bankUser = {
  email: process.env.BANK_EMAIL || '',
  password: process.env.BANK_PASSWORD || ''
};

export const shopUser = {
  email: process.env.SHOP_EMAIL || bankUser.email,
  password: process.env.SHOP_PASSWORD || bankUser.password
};

export const bankUsers = [
  { ...bankUser, expectSuccess: true },
  { email: 'invalid-user@example.com', password: 'Invalid-Password-123!', expectSuccess: false }
];

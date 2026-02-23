module.exports= {port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiry: '24h',
  bcryptSaltRounds: 10,
};
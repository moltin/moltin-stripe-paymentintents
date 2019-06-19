require('dotenv').config()

module.exports = {
  target: 'serverless',
  env: {
    API_HOST: process.env.API_HOST || 'http://localhost:3000/api',
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY
  }
}

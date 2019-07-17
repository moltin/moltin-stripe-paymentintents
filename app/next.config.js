require('dotenv').config()

module.exports = {
  target: 'serverless',
  env: {
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY
  }
}

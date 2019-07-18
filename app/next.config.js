require('dotenv').config()

module.exports = {
  target: 'serverless',
  env: {
    MOLTIN_CLIENT_ID: process.env.MOLTIN_CLIENT_ID,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY
  }
}

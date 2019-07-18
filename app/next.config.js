require('dotenv').config()
const withCSS = require('@zeit/next-css')

module.exports = withCSS({
  target: 'serverless',
  env: {
    MOLTIN_CLIENT_ID: process.env.MOLTIN_CLIENT_ID,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY
  }
})

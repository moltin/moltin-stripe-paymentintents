const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = async ({ body }, res) => {
  try {
    const { amount, currency } = JSON.parse(body)

    const { client_secret } = await stripe.paymentIntents.create({
      amount,
      currency
    })

    res.status(201).json({ client_secret })
  } catch (error) {
    res.status(500).send(error)
  }
}

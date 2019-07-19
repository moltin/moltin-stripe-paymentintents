const { isRequired } = require('../../utils/helpers')

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = async ({ body }, res) => {
  try {
    const {
      amount = isRequired('Amount'),
      currency = isRequired('Currency'),
      order_id = isRequired('Order ID')
    } = JSON.parse(body)

    const { client_secret } = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { order_id }
    })

    res.status(201).json({ client_secret })
  } catch (error) {
    res.status(500).send(error)
  }
}

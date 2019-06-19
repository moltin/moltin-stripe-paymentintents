const { MoltinClient } = require('@moltin/request')

const moltin = new MoltinClient({
  client_id: process.env.MOLTIN_CLIENT_ID,
  client_secret: process.env.MOLTIN_CLIENT_SECRET
})

module.exports = async ({ query: { orderId } }, res) => {
  try {
    const {
      data: [{ id: transactionId }]
    } = await moltin.get(`orders/${orderId}/transactions`)

    res.send(
      await moltin.post(
        `orders/${orderId}/transactions/${transactionId}/capture`
      )
    )
  } catch ({ status }) {
    res.status(500).json({ error })
  }
}

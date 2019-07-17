const { MoltinClient } = require('@moltin/request')

const moltin = new MoltinClient({
  client_id: process.env.MOLTIN_CLIENT_ID,
  client_secret: process.env.MOLTIN_CLIENT_SECRET
})

module.exports = async (
  {
    body: {
      data: {
        object: { metadata }
      }
    }
  },
  res
) => {
  try {
    const {
      data: [{ id: transaction_id }]
    } = await moltin.get(`orders/${metadata.order_id}/transactions`)

    res.send(
      await moltin.post(
        `orders/${metadata.order_id}/transactions/${transaction_id}/capture`
      )
    )
  } catch ({ status }) {
    res.status(500).json({ error })
  }
}

const { MoltinClient } = require('@moltin/request')

const moltin = new MoltinClient({
  client_id: process.env.MOLTIN_CLIENT_ID
})

module.exports = async ({ query: { orderId } }, res) => {
  try {
    res.send(
      await moltin.post(`orders/${orderId}/payments`, {
        gateway: 'manual',
        method: 'authorize'
      })
    )
  } catch (error) {
    res.status(500).json({ error })
  }
}

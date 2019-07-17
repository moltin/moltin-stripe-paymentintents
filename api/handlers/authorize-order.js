const { MoltinClient } = require('@moltin/request')

const moltin = new MoltinClient({
  client_id: process.env.MOLTIN_CLIENT_ID
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
    res.send(
      await moltin.post(`orders/${metadata.order_id}/payments`, {
        gateway: 'manual',
        method: 'authorize'
      })
    )
  } catch (error) {
    res.status(500).json({ error })
  }
}

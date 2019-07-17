import React, { useState } from 'react'
import { Form } from 'react-final-form'
import { CardElement, injectStripe } from 'react-stripe-elements'
import fetch from 'isomorphic-unfetch'

function CheckoutForm({ stripe }) {
  const [checkoutError, setCheckoutError] = useState(null)

  async function onSubmit() {
    try {
      const order_id = '4b760a9e-29ef-4764-9b7e-2013931c3625'

      const stripePaymentIntent = await fetch('/api/intent', {
        method: 'POST',
        body: JSON.stringify({
          amount: 9999,
          currency: 'usd',
          order_id
        })
      })
      const { client_secret } = await stripePaymentIntent.json()

      await stripe.handleCardPayment(client_secret)
    } catch (err) {
      setCheckoutError('There was a problem processing your order payment')
    }
  }

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => {
        return (
          <form onSubmit={handleSubmit}>
            {checkoutError && { checkoutError }}
            <CardElement />
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting' : 'Submit'}
            </button>
          </form>
        )
      }}
    />
  )
}

export default injectStripe(CheckoutForm)

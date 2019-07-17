import React, { useState } from 'react'
import { Form } from 'react-final-form'
import { CardElement, injectStripe } from 'react-stripe-elements'
import fetch from 'isomorphic-unfetch'

function CheckoutForm({ stripe }) {
  const [checkoutError, setCheckoutError] = useState(null)

  async function onSubmit() {
    try {
      await fetch(
        `${
          process.env.API_HOST
        }/authorize/c71c078c-da11-43f8-8bbb-3dae11a9cc1d`,
        {
          method: 'POST'
        }
      )
      const stripePaymentIntent = await fetch(
        `${process.env.API_HOST}/intent`,
        {
          method: 'POST',
          body: JSON.stringify({
            amount: 9999,
            currency: 'usd'
          })
        }
      )
      const { client_secret } = await stripePaymentIntent.json()

      await stripe.handleCardPayment(client_secret)

      await fetch(
        `${process.env.API_HOST}/capture/c71c078c-da11-43f8-8bbb-3dae11a9cc1d`,
        {
          method: 'POST'
        }
      )
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

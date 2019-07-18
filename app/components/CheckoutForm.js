import React, { useContext, useState } from 'react'
import { Form } from 'react-final-form'
import { CardElement, injectStripe } from 'react-stripe-elements'
import fetch from 'isomorphic-unfetch'

import CartContext from '../context/CartContext'

function CheckoutForm({ stripe }) {
  const {
    addToCart,
    cartAmount,
    cartCurrency,
    cartId,
    cartTotal,
    checkoutCart,
    productId
  } = useContext(CartContext)
  const [checkoutError, setCheckoutError] = useState(null)

  async function onSubmit() {
    try {
      const { order_id } = await checkoutCart({
        cartId,
        name: 'Jonathan Steele',
        email: 'jonathan@moltin.com'
      })

      const stripePaymentIntent = await fetch('/api/intent', {
        method: 'POST',
        body: JSON.stringify({
          amount: cartAmount,
          currency: cartCurrency,
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
    <React.Fragment>
      {cartAmount}
      {cartCurrency}
      {cartTotal}
      <button onClick={() => addToCart({ productId, quantity: 1 })}>Add</button>
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, submitting }) => {
          return (
            <form onSubmit={handleSubmit}>
              {checkoutError && checkoutError}
              <CardElement />
              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting' : 'Submit'}
              </button>
            </form>
          )
        }}
      />
    </React.Fragment>
  )
}

export default injectStripe(CheckoutForm)

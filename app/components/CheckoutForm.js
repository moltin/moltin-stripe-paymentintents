import React, { useContext, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { CardElement, injectStripe } from 'react-stripe-elements'
import fetch from 'isomorphic-unfetch'

import CartContext from '../context/CartContext'

function CheckoutForm({ stripe }) {
  const {
    addingToCart,
    cartAmount,
    cartCurrency,
    cartId,
    cartTotal,
    checkoutCart
  } = useContext(CartContext)

  async function onSubmit() {
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
  }

  return (
    <section className="bg-white p-2 rounded shadow">
      <header className="mb-4">
        <h1 className="font-medium text-xl text-gray-800">Checkout</h1>
      </header>
      <Form
        onSubmit={onSubmit}
        validate={values => {
          const errors = {}

          if (!values.stripe || !values.stripe.complete) {
            if (!errors.stripe) {
              errors.stripe = {}
            }

            errors.stripe.complete = 'Required'
          }

          return errors
        }}
      >
        {({ form, handleSubmit, submitSucceeded, submitting }) => {
          const disableButton = submitting || addingToCart || cartAmount === 0
          const onStripeChange = e => form.change('stripe', e)

          return (
            <React.Fragment>
              {submitSucceeded ? (
                <div className="my-4 text-gray-600 text-center">
                  Thank you for your order!
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="">
                    <Field name="stripe">
                      {({ meta }) => (
                        <React.Fragment>
                          <label className="block font-medium mb-4 text-sm">
                            Card details
                          </label>
                          <CardElement
                            onChange={onStripeChange}
                            disabled={disableButton}
                            hidePostalCode={true}
                            className={`border-2 mb-4 p-4 rounded ${
                              meta.error && meta.touched
                                ? 'border-red-400'
                                : 'border-gray-300'
                            }`}
                          />
                        </React.Fragment>
                      )}
                    </Field>
                  </div>
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
                    type="submit"
                    disabled={disableButton}
                  >
                    {submitting
                      ? 'Processing'
                      : cartAmount === 0
                      ? 'Cart is empty'
                      : `Checkout and pay ${cartTotal}`}
                  </button>
                </form>
              )}
            </React.Fragment>
          )
        }}
      </Form>
    </section>
  )
}

export default injectStripe(CheckoutForm)

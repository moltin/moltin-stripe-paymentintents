import React, { useContext, useState } from 'react'
import { Field, Form } from 'react-final-form'
import { CardElement, injectStripe } from 'react-stripe-elements'

import CartContext from '../context/CartContext'

function CheckoutForm({ stripe }) {
  const {
    addingToCart,
    cartAmount,
    cartId,
    cartTotal,
    checkoutCart,
    checkoutComplete,
    checkoutError,
    checkoutFailed,
    checkoutProcessing,
    checkoutSuccess,
    checkingOutCart,
    confirmTransaction,
    payForOrder
  } = useContext(CartContext)
  const [cardElement, setCardElement] = useState(null)

  async function onSubmit({ name, email }) {
    try {
      checkoutProcessing()

      const {
        paymentMethod: { id: payment }
      } = await stripe.createPaymentMethod('card')

      const { order_id } = await checkoutCart({
        cartId,
        name,
        email
      })

      const {
        client_secret, status, id,
        transaction_id
      } = await payForOrder({
        orderId: order_id,
        payment
      })

      if (status === 'requires_action') {
        const { error } = await stripe.handleCardAction(client_secret)

        if (error)
          throw {
            status: 401,
            detail: 'Payment authentication failed. Please check and try again'
          }
      }

      await confirmTransaction({
        orderId: order_id,
        payment,
        transactionId: transaction_id
      })

      checkoutComplete()
      cardElement.clear()
    } catch ({
      status = 400,
      detail = 'There was a problem processing your order'
    }) {
      checkoutFailed(detail)
    }
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

          if (!values.email) errors.email = 'Email address is required'

          if (!values.name) errors.name = 'Name is required'

          if (!values.stripe || !values.stripe.complete) {
            if (!errors.stripe) {
              errors.stripe = {}
            }

            errors.stripe.complete = 'Payment details are required'
          }

          return errors
        }}
      >
        {({ form, handleSubmit }) => {
          const disableButton =
            checkingOutCart || addingToCart || cartAmount === 0
          const onStripeChange = e => form.change('stripe', e)

          return (
            <React.Fragment>
              {checkoutError && (
                <div className="bg-red-200 border border-red-300 my-4 p-2 rounded text-center text-red-600 text-sm">
                  {checkoutError}
                </div>
              )}
              {checkoutSuccess && (
                <div className="bg-green-200 border border-green-300 my-4 p-2 rounded text-center text-green-600 text-sm">
                  Thank you for your order!
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="flex -mx-2">
                  <Field name="name">
                    {({ input, meta }) => (
                      <div className="flex flex-col mb-4 px-2 w-1/2">
                        <label className="block font-medium mb-2 text-sm">
                          Name
                        </label>
                        <input
                          {...input}
                          type="text"
                          disabled={checkingOutCart || addingToCart}
                          className={`border-2 mb-2 p-2 rounded ${
                            meta.error && meta.touched
                              ? 'border-red-400'
                              : 'border-gray-300'
                          } ${
                            checkingOutCart || addingToCart
                              ? 'opacity-50'
                              : 'opacity-100'
                          }`}
                        />
                        {meta.error && meta.touched && (
                          <span className="text-red-400 text-sm">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    )}
                  </Field>
                  <Field name="email">
                    {({ input, meta }) => (
                      <div className="flex flex-col mb-4 px-2 w-1/2">
                        <label className="block font-medium mb-2 text-sm">
                          Email address
                        </label>
                        <input
                          {...input}
                          type="email"
                          disabled={checkingOutCart || addingToCart}
                          className={`border-2 mb-2 p-2 rounded ${
                            meta.error && meta.touched
                              ? 'border-red-400'
                              : 'border-gray-300'
                          } ${
                            checkingOutCart || addingToCart
                              ? 'opacity-50'
                              : 'opacity-100'
                          }`}
                        />
                        {meta.error && meta.touched && (
                          <span className="text-red-400 text-sm">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    )}
                  </Field>
                </div>
                <Field name="stripe">
                  {({ meta }) => (
                    <div className="mb-4">
                      <label className="block font-medium mb-2 text-sm">
                        Card details
                      </label>
                      <CardElement
                        onChange={onStripeChange}
                        onReady={el => setCardElement(el)}
                        disabled={disableButton}
                        hidePostalCode={true}
                        className={`border-2 mb-2 px-2 py-4 rounded ${
                          meta.error && meta.touched
                            ? 'border-red-400'
                            : 'border-gray-300'
                        }`}
                      />
                      {meta.error && meta.touched && (
                        <span className="text-red-400 text-sm">
                          {meta.error.complete}
                        </span>
                      )}
                    </div>
                  )}
                </Field>
                <button
                  className={`bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full ${
                    disableButton
                      ? 'cursor-not-allowed opacity-50'
                      : 'opacity-100'
                  }`}
                  type="submit"
                  disabled={disableButton}
                >
                  {checkingOutCart
                    ? 'Processing'
                    : addingToCart
                    ? 'Updating cart'
                    : cartAmount === 0
                    ? 'Cart is empty'
                    : `Checkout and pay ${cartTotal}`}
                </button>
              </form>
            </React.Fragment>
          )
        }}
      </Form>
    </section>
  )
}

export default injectStripe(CheckoutForm)

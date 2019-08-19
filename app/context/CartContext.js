import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState
} from 'react'
import { createCartIdentifier } from '@moltin/request'

import MoltinContext from './MoltinContext'

let CartContext

const { Provider } = (CartContext = createContext())

const initialCart = {
  addingToCart: false,
  cartAmount: 0,
  cartCurrency: 'USD',
  cartItems: null,
  cartTotal: 0,
  checkingOutCart: false
}

function cartReducer(cart, { payload, type }) {
  switch (type) {
    case 'ADD_TO_CART':
      return {
        ...cart,
        addingToCart: true
      }

    case 'CHECKOUT_CART':
      return {
        ...cart,
        checkingOutCart: true
      }

    case 'SET_CART':
      const { data: items, meta } = payload

      const cartItems = items.filter(({ type }) => type === 'cart_item')

      const {
        amount: cartAmount,
        currency: cartCurrency,
        formatted: cartTotal
      } = meta.display_price.without_tax

      return {
        ...cart,
        addingToCart: false,
        cartAmount,
        cartCurrency,
        cartItems,
        cartTotal
      }

    case 'RESET_CART':
      return initialCart

    default:
      return cart
  }
}

function CartProvider({ children }) {
  const { moltin } = useContext(MoltinContext)
  const [cart, cartDispatch] = useReducer(cartReducer, initialCart)
  const [productId, setProductId] = useState(null)
  const [cartId, setCartId] = useState(createCartIdentifier())

  useEffect(() => {
    getProduct()
  }, [])

  function resetCart() {
    cartDispatch({ type: 'RESET_CART' })

    setCartId(createCartIdentifier())
  }

  async function getProduct() {
    const {
      data: [{ id }]
    } = await moltin.get('products')

    setProductId(id)
  }

  async function addToCart({ productId: id, quantity }) {
    cartDispatch({ type: 'ADD_TO_CART' })

    const payload = await moltin.post(`carts/${cartId}/items`, {
      type: 'cart_item',
      id,
      quantity
    })

    cartDispatch({ type: 'SET_CART', payload })
  }

  async function checkoutCart({ cartId, name, email }) {
    cartDispatch({ type: 'CHECKOUT_CART' })

    const postalAddress = {
      first_name: 'Jonathan',
      last_name: 'Steele',
      company_name: 'Moltin',
      line_1: 'British India House',
      line_2: '15 Carliol Square',
      city: 'Newcastle upon Tyne',
      postcode: 'NE1 6UF',
      county: 'Tyne & Wear',
      country: 'UK'
    }

    const {
      data: { id }
    } = await moltin.post(`carts/${cartId}/checkout`, {
      customer: {
        name,
        email
      },
      billing_address: postalAddress,
      shipping_address: postalAddress
    })

    return { order_id: id }
  }

  async function payForOrder({ orderId, payment }) {
    const {
      data: { client_secret, id: transaction_id }
    } = await moltin.post(`orders/${orderId}/payments`, {
      gateway: 'stripe_payment_intents',
      method: 'purchase',
      payment
    })

    return { client_secret, transaction_id }
  }

  async function confirmTransaction({ orderId, payment, transactionId }) {
    await moltin.post(
      `orders/${orderId}/transactions/${transactionId}/confirm`,
      {
        payment,
        gateway: 'stripe_payment_intents'
      }
    )
  }

  return (
    <Provider
      value={{
        ...cart,
        addToCart,
        cartId,
        checkoutCart,
        confirmTransaction,
        payForOrder,
        productId,
        resetCart
      }}
    >
      {children}
    </Provider>
  )
}

export { CartProvider, CartContext as default }

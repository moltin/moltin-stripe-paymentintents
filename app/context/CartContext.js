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

const initialState = {
  cartCurrency: 'USD',
  cartAmount: 0,
  cartTotal: 0
}

function cartReducer(cart, { payload, type }) {
  switch (type) {
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
        cartAmount,
        cartCurrency,
        cartItems,
        cartTotal
      }

    default:
      return cart
  }
}

function CartProvider({ children }) {
  const { moltin } = useContext(MoltinContext)
  const [cart, cartDispatch] = useReducer(cartReducer, initialState)
  const [productId, setProductId] = useState(null)
  const [cartId] = useState(createCartIdentifier())

  useEffect(() => {
    getProduct()
  }, [])

  async function getProduct() {
    const {
      data: [{ id }]
    } = await moltin.get('products')

    setProductId(id)
  }

  async function addToCart({ productId: id, quantity }) {
    const payload = await moltin.post(`carts/${cartId}/items`, {
      type: 'cart_item',
      id,
      quantity
    })

    cartDispatch({ type: 'SET_CART', payload })
  }

  async function checkoutCart({ cartId, name, email }) {
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

  return (
    <Provider value={{ ...cart, addToCart, cartId, checkoutCart, productId }}>
      {children}
    </Provider>
  )
}

export { CartProvider, CartContext as default }
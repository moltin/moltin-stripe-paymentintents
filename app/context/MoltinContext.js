import React, { createContext } from 'react'
import { MoltinClient } from '@moltin/request'

import { CartProvider } from './CartContext'

let MoltinContext

const { Provider } = (MoltinContext = createContext())

function MoltinProvider({ children, clientId: client_id }) {
  const moltin = new MoltinClient({
    client_id
  })

  return (
    <Provider value={{ moltin }}>
      <CartProvider>{children}</CartProvider>
    </Provider>
  )
}

export { MoltinProvider, MoltinContext as default }

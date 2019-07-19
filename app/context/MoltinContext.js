import React, { createContext } from 'react'
import { MoltinClient } from '@moltin/request'

import { CartProvider } from './CartContext'
import MoltinLocalStorageAdapter from '../utils/MoltinLocalStorageAdapter'

let MoltinContext

const { Provider } = (MoltinContext = createContext())

function MoltinProvider({ children, clientId: client_id }) {
  const moltin = new MoltinClient({
    client_id,
    storage: new MoltinLocalStorageAdapter()
  })

  return (
    <Provider value={{ moltin }}>
      <CartProvider>{children}</CartProvider>
    </Provider>
  )
}

export { MoltinProvider, MoltinContext as default }

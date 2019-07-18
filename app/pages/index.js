import { Elements } from 'react-stripe-elements'

import Cart from '../components/Cart'
import CheckoutForm from '../components/CheckoutForm'
import '../styles/index.css'

function Index() {
  return (
    <Elements>
      <main className="mx-auto py-12 w-1/2">
        <div className="flex -mx-2">
          <div className="px-2 w-2/3">
            <CheckoutForm />
          </div>
          <div className="px-2 w-1/3">
            <Cart />
          </div>
        </div>
      </main>
    </Elements>
  )
}

export default Index

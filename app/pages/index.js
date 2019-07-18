import { Elements } from 'react-stripe-elements'

import Cart from '../components/Cart'
import CheckoutForm from '../components/CheckoutForm'
import '../styles/index.css'

function Index() {
  return (
    <Elements>
      <main className="mx-auto px-4 py-12 sm:w-10/12 lg:w-2/3">
        <div className="md:flex -mx-2">
          <div className="md:order-2 px-2 mb-4 md:mb-0 md:w-1/3">
            <Cart />
          </div>
          <div className="md:order-1 px-2 md:w-2/3">
            <CheckoutForm />
          </div>
        </div>
      </main>
    </Elements>
  )
}

export default Index

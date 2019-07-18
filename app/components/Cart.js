import React, { useContext } from 'react'

import CartContext from '../context/CartContext'

function Cart() {
  const { addToCart, addingToCart, cartItems, productId } = useContext(
    CartContext
  )

  return (
    <section className="bg-white rounded shadow">
      <header className="p-2">
        <h1 className="font-medium text-xl text-gray-800">Cart</h1>
      </header>
      <div className="pb-4">
        {addingToCart ? (
          <div className="text-gray-600 text-center">Updating cart</div>
        ) : cartItems ? (
          cartItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <div
                className={`flex items-center px-2 ${index ===
                  cartItems.length && 'mb-4'}`}
              >
                <img src={item.image.href} className="h-12 w-12" />
                <div className="flex flex-auto flex-col">
                  <p>{item.name}</p>
                  <span className="text-gray-600 text-xs">{item.sku}</span>
                </div>
                <span className="bg-gray-600 flex flex-none justify-end px-1 rounded text-xs text-white">
                  {item.quantity}
                </span>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="text-gray-600 text-center">Cart is empty</div>
        )}
      </div>
      {!addingToCart && (
        <footer className="border-t-2 p-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
            onClick={() => addToCart({ productId, quantity: 1 })}
          >
            Add to cart
          </button>
        </footer>
      )}
    </section>
  )
}

export default Cart

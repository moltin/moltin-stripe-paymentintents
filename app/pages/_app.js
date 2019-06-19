import App, { Container } from 'next/app'
import Head from 'next/head'

import StripeProvider from '../components/StripeProvider'

class StripeApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <script id="stripe-js" src="https://js.stripe.com/v3/" async />
        </Head>
        <StripeProvider>
          <Component {...pageProps} />
        </StripeProvider>
      </Container>
    )
  }
}

export default StripeApp

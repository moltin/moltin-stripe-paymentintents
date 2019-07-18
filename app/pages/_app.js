import App, { Container } from 'next/app'
import Head from 'next/head'

import StripeProvider from '../components/StripeProvider'
import { MoltinProvider } from '../context/MoltinContext'

class StripeApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Head>
          <script id="stripe-js" src="https://js.stripe.com/v3/" async />
        </Head>
        <MoltinProvider clientId={process.env.MOLTIN_CLIENT_ID}>
          <StripeProvider>
            <Component {...pageProps} />
          </StripeProvider>
        </MoltinProvider>
      </Container>
    )
  }
}

export default StripeApp

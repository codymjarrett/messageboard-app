import '../../styles/globals.css'

import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { ChakraProvider } from '@chakra-ui/react'

import { QueryClientProvider } from '@tanstack/react-query'

import queryClient from '../queryClient'

import Layout from '../components/Layout/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </QueryClientProvider>
    </UserProvider>
  )
}

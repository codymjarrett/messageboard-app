import '../../styles/globals.css'

import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'

import Layout from '../components/Layout/Layout'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>{' '}
    </UserProvider>
  )
}

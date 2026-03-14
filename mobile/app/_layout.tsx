import { appKit, wagmiAdapter } from '@/appkit-config'
import { AppKitProvider } from '@reown/appkit-react-native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { YieldProvider } from '@yo-protocol/react'
import { Slot } from 'expo-router'
import 'react-native-reanimated'
import { WagmiProvider } from 'wagmi'

export const unstable_settings = {
  anchor: '(tabs)',
}

const queryClient = new QueryClient()

export default function RootLayout() {
  return (
    <AppKitProvider instance={appKit}>
      <WagmiProvider config={wagmiAdapter.wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <YieldProvider>
            <Slot />
          </YieldProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AppKitProvider>
  )
}

import 'react-native-reanimated'

import { base, PrivyProvider, baseSepolia, sepolia } from '@privy-io/expo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { YieldProvider } from '@yo-protocol/react'
import { Slot } from 'expo-router'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter'
import { useFonts } from 'expo-font'

export const unstable_settings = {
  anchor: '(tabs)',
}

const config = createConfig({
  chains: [sepolia],
  connectors: [],
  multiInjectedProviderDiscovery: false,
  ssr: true,
  transports: {
    [sepolia.id]: http(),
  },
})

const queryClient = new QueryClient()

export default function RootLayout() {
  useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  })

  return (
    <WagmiProvider config={config}>
      <PrivyProvider
        appId="cmmq2zkod01r80djovheqamtg"
        clientId="client-WY6WvVjBm3D74EetctCpcB6k7W99DL6BJmaN6XR9z1VfS"
        supportedChains={[sepolia]}
        config={{
          embedded: {
            ethereum: {
              createOnLogin: 'users-without-wallets',
            },
          },
        }}
      >
        <QueryClientProvider client={queryClient}>
          <YieldProvider>
            <Slot />
          </YieldProvider>
        </QueryClientProvider>
      </PrivyProvider>
    </WagmiProvider>
  )
}

import '@walletconnect/react-native-compat'

import { createAppKit } from '@reown/appkit-react-native'
import { WagmiAdapter } from '@reown/appkit-wagmi-react-native'
import { base } from 'wagmi/chains'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { safeJsonParse, safeJsonStringify } from '@walletconnect/safe-json'
import { PhantomConnector } from '@reown/appkit-solana-react-native'

const projectId = '443ecb69f17c08fb9c29ad005d570bd2'

const storage = {
  getKeys: async () => {
    return (await AsyncStorage.getAllKeys()) as string[]
  },
  getEntries: async <T = any>(): Promise<[string, T][]> => {
    const keys = await AsyncStorage.getAllKeys()
    return await Promise.all(
      keys.map(async (key) => [key, safeJsonParse((await AsyncStorage.getItem(key)) ?? '') as T])
    )
  },
  setItem: async <T = any>(key: string, value: T) => {
    await AsyncStorage.setItem(key, safeJsonStringify(value))
  },
  getItem: async <T = any>(key: string): Promise<T | undefined> => {
    const item = await AsyncStorage.getItem(key)
    if (typeof item === 'undefined' || item === null) {
      return undefined
    }

    return safeJsonParse(item) as T
  },
  removeItem: async (key: string) => {
    await AsyncStorage.removeItem(key)
  },
}

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks: [base],
})

export const appKit = createAppKit({
  projectId,
  adapters: [wagmiAdapter],
  storage,
  metadata: {
    name: 'Rizz',
    description: 'Rizz is a platform for trading and investing in crypto',
    url: 'https://rizz.com',
    icons: ['https://rizz.com/icon.png'],
    redirect: {
      native: 'rizz://',
      universal: 'https://rizz.com',
    },
  },
  defaultNetwork: base,
  networks: [base],
  features: {
    onramp: true,
  },
  extraConnectors: [
    new PhantomConnector({ cluster: 'mainnet-beta' }), // Or 'devnet', 'testnet'
  ],
})

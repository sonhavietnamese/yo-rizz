import {
  baseSepolia,
  sepolia,
  useEmbeddedEthereumWallet,
  useLinkWithOAuth,
  useLoginWithOAuth,
  usePrivy,
} from '@privy-io/expo'
import { PrivyElements } from '@privy-io/expo/ui'
import { useVaults } from '@yo-protocol/react'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function HomeScreen() {
  const { isReady, user } = usePrivy()
  const { login, state: loginState } = useLoginWithOAuth()
  const { link, state: linkState } = useLinkWithOAuth()

  const [result, setResult] = useState<string | null>(null)
  const [balance, setBalance] = useState<string>('0')

  const { wallets } = useEmbeddedEthereumWallet()
  const wallet = wallets?.[0]

  // useEffect(() => {
  //   const fetchBalance = async () => {
  //     if (!wallet?.address) return

  //     const provider = await wallet.getProvider?.()
  //     if (!provider) return

  //     try {
  //       const balanceHex = await provider.request({
  //         method: 'eth_getBalance',
  //         params: [wallet.address, 'latest'],
  //       })
  //       const balanceWei = BigInt(balanceHex as string)
  //       const balanceEth = Number(balanceWei) / 1e18
  //       setBalance(balanceEth.toFixed(4))
  //     } catch (error) {
  //       console.error('Error fetching balance:', error)
  //     }
  //   }

  //   fetchBalance()
  // }, [wallet?.address])

  const handleConnectGoogle = useCallback(async () => {
    try {
      if (user) {
        await link({ provider: 'google' })
      } else {
        await login({ provider: 'google' })
      }
    } catch (err) {
      console.error('Google connect error:', err)
    }
  }, [user, link, login])

  const signTransaction = async () => {
    const provider = await wallet?.getProvider?.()
    if (!provider) return

    try {
      const signedTx = await provider.request({
        method: 'eth_signTransaction',
        params: [
          {
            from: wallet.address,
            to: '0x0000000000000000000000000000000000000000',
            value: '0x1',
            gasLimit: '0x5208',
            chainId: sepolia.id,
          },
        ],
      })
      setResult(typeof signedTx === 'string' ? signedTx : JSON.stringify(signedTx))
    } catch (error) {
      console.error('Sign transaction error:', error)
      setResult(JSON.stringify(error))
    }
  }

  const signAndSendTransaction = async () => {
    const provider = await wallet?.getProvider?.()
    if (!provider) return

    try {
      const response = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: wallet.address,
            to: '0x0000000000000000000000000000000000000000',
            value: '0x1',
            gasLimit: '0x5208',
            chainId: sepolia.id,
          },
        ],
      })
      setResult(JSON.stringify(response))
      console.log('response', response)
    } catch (error) {
      console.error('Send transaction error:', error)
      setResult(JSON.stringify(error))
    }
  }

  const isGoogleLoading = loginState.status === 'loading' || linkState.status === 'loading'
  const hasGoogleLinked = user?.linked_accounts?.some((a) => 'type' in a && a.type === 'google_oauth')

  if (!isReady) return <Text>Loading...</Text>

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello World</Text>
      <PrivyElements />

      <Text>{user?.id}</Text>
      <Text>{wallet?.address}</Text>

      <TouchableOpacity
        style={[styles.button, isGoogleLoading && styles.buttonDisabled]}
        onPress={handleConnectGoogle}
        disabled={isGoogleLoading}
      >
        {isGoogleLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>
            {user ? (hasGoogleLinked ? 'Google Connected' : 'Connect Google') : 'Sign in with Google'}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.signButton]} onPress={signTransaction} disabled={!user}>
        <Text style={styles.buttonText}>Sign Transaction</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.sendButton]} onPress={signAndSendTransaction} disabled={!user}>
        <Text style={styles.buttonText}>Send Transaction</Text>
      </TouchableOpacity>

      <VaultInfo />

      <Text>Balance: {balance} ETH</Text>

      {result && <Text>{result}</Text>}
    </View>
  )
}

function VaultInfo() {
  const { vaults, isLoading, isError, error } = useVaults()

  if (isLoading) return <Text>Loading vault...</Text>
  if (isError) return <Text>Error: {error?.message}</Text>

  return (
    <View>
      <Text>{vaults[0]?.name}</Text>
      <Text>Total Assets: {vaults[0]?.tvl.formatted}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4285F4',
    borderRadius: 8,
  },
  signButton: {
    backgroundColor: '#34A853',
  },
  sendButton: {
    backgroundColor: '#EA4335',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signature: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  error: {
    marginTop: 8,
    fontSize: 12,
    color: '#c00',
  },
})

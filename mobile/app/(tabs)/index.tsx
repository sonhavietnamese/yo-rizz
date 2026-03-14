import { Button, StyleSheet, Text, View } from 'react-native'
import { useVaults } from '@yo-protocol/react'
import { AppKit, useAppKit, useAccount } from '@reown/appkit-react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>

      <VaultInfo />
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
      <AppKit />

      <ConnectButton />
    </View>
  )
}

function ConnectButton() {
  const { open, disconnect } = useAppKit()
  const { address, isConnected, chainId } = useAccount()

  if (isConnected) {
    return (
      <View>
        <Text>Connected to: {chainId}</Text>
        <Text>Address: {address}</Text>
        <Button title="Disconnect" onPress={() => disconnect()} />
      </View>
    )
  }

  return <Button title="Connect Wallet" onPress={() => open()} />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#4285F4',
    borderRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

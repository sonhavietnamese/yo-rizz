import { Button, StyleSheet, Text, View } from 'react-native'
import { useVaults } from '@yo-protocol/react'
import { AppKit, useAppKit, useAccount } from '@reown/appkit-react-native'
import { useSignMessage } from 'wagmi'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <AppKit />
      <VaultInfo />
      <ConnectButton />
      <SwapButton />
      <OnRampButton />
      <OpenAccountButton />
      <SignMessageButton />
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

function SwapButton() {
  const { open } = useAppKit()

  const handleSwapPress = () => {
    open({ view: 'Swap' })
  }

  return <Button title="Swap Tokens" onPress={handleSwapPress} />
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

function OnRampButton() {
  const { open } = useAppKit()

  const handleOnRampPress = () => {
    open({ view: 'OnRamp' })
  }

  return <Button title="Buy Crypto" onPress={handleOnRampPress} />
}

function OpenAccountButton() {
  const { open } = useAppKit()

  const handleOpenAccountPress = () => {
    open({ view: 'Account' })
  }

  return <Button title="Open Account" onPress={handleOpenAccountPress} />
}

function SignMessageButton() {
  const { isConnected } = useAccount()
  const { mutate: signMessage, data: signature, error, isPending } = useSignMessage()

  const handleSignPress = () => {
    signMessage({ message: 'Hello from Yo Rizz! 👋' })
  }

  if (!isConnected) {
    return <Button title="Sign Message" disabled />
  }

  return (
    <View>
      <Button
        title={isPending ? 'Check Wallet...' : 'Sign Message'}
        onPress={handleSignPress}
        disabled={isPending}
      />
      {signature && <Text style={styles.signature}>Signature: {signature.slice(0, 20)}...</Text>}
      {error && <Text style={styles.error}>Error: {error.message}</Text>}
    </View>
  )
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

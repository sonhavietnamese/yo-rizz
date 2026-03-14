import { useLoginWithOAuth, usePrivy } from '@privy-io/expo'
import { PrivyElements } from '@privy-io/expo/ui'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export default function HomeScreen() {
  const { isReady, user } = usePrivy()
  const { login, state } = useLoginWithOAuth()

  if (!isReady) {
    return <Text>Loading...</Text>
  }

  if (user) {
    return (
      <View style={styles.container}>
        <Text>Hello {user.id}</Text>
        <PrivyElements />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <Text>Hello World</Text>
      <Pressable
        onPress={() => login({ provider: 'google' })}
        disabled={state.status === 'loading'}
        style={({ pressed }) => [
          styles.button,
          (state.status === 'loading' || pressed) && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.buttonText}>
          {state.status === 'loading' ? 'Logging in...' : 'lets go'}
        </Text>
      </Pressable>
      <PrivyElements />
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
})

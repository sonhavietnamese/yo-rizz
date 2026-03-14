import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter'
import { useFonts } from 'expo-font'
import { Slot } from 'expo-router'
import 'react-native-reanimated'

import { PrivyProvider } from '@privy-io/expo'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  })

  return (
    <PrivyProvider appId="cmmq2zkod01r80djovheqamtg" clientId="client-WY6WvVjBm3D74EetctCpcB6k7W99DL6BJmaN6XR9z1VfS">
      <Slot />
    </PrivyProvider>
  )
}

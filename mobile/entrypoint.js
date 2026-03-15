// Import required polyfills first - ORDER MATTERS
// react-native-get-random-values must run before anything that uses crypto/uuid
import 'fast-text-encoding'
import 'react-native-get-random-values'

import '@ethersproject/shims'
// Then import the expo router
import 'expo-router/entry'

import { Buffer } from 'buffer'
global.Buffer = Buffer

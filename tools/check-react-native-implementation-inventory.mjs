#!/usr/bin/env node

import { loadAndValidateNativeInventory } from './lib/react-native-implementation-inventory.mjs';

const inventory = loadAndValidateNativeInventory();
process.stdout.write(
  `OK: ${inventory.implementations.length} native implementations match package, symbols, contracts, and recipes.\n`,
);

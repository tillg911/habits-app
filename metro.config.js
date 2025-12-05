const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Remove .mjs from source extensions to force CommonJS resolution
// This prevents Zustand's ESM files (which use import.meta) from being bundled
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'mjs');

// Prioritize CommonJS resolution
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Ensure .cjs files can be resolved
if (!config.resolver.sourceExts.includes('cjs')) {
  config.resolver.sourceExts.push('cjs');
}

module.exports = config;

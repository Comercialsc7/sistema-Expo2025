const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Expo SDK 53 specific resolver configuration for Node.js modules
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Lista reduzida de módulos Node.js desabilitados
  if (
    moduleName === 'fs' ||
    moduleName === 'path' ||
    moduleName === 'os' ||
    moduleName.startsWith('node:')
  ) {
    return {
      type: 'empty',
    };
  }

  // Default resolver
  return context.resolveRequest(context, moduleName, platform);
};

// Desabilitar a resolução de package exports que causa conflitos
config.resolver.unstable_enablePackageExports = false;

module.exports = withNativeWind(config, { input: "./global.css" });
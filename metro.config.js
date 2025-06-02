const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Adiciona suporte para resolver módulos
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

// Adiciona resolução extra para o nanoid
config.resolver.extraNodeModules = {
  'nanoid/non-secure': require.resolve('nanoid/non-secure'),
};

module.exports = config; 
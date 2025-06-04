const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for resolving modules including .mjs files
config.resolver.sourceExts = ['mjs', 'jsx', 'js', 'ts', 'tsx', 'json'];
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp'];

// Add resolution for nanoid and other problematic modules
config.resolver.extraNodeModules = {
  'nanoid/non-secure': require.resolve('nanoid/non-secure'),
  '@supabase/postgrest-js': require.resolve('@supabase/postgrest-js'),
};

module.exports = config;
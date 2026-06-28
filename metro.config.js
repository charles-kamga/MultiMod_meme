const fs = require('fs');
const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const realProjectRoot = fs.realpathSync(__dirname);

const config = {
  projectRoot: realProjectRoot,
  watchFolders: Array.from(new Set([realProjectRoot, __dirname])),
  resolver: {
    nodeModulesPaths: [path.join(realProjectRoot, 'node_modules')],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

const { withGradleProperties, withPodfileProperties } = require('expo/config-plugins');

const { withMacOSPodfileProperties } = require('../macos/base');
const withWindowsExperimentalFeatures = require('../windows/withExperimentalFeatures');

/**
 * Enable Hermes on all supported platforms, including out-of-tree platforms.
 * This enables Hermes on Android, iOS, MacOS, and Windows.
 * No properties are supported, remove the plugin to disable the Hermes switch.
 *
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
function withHermes(config) {
  config = withHermesAndroid(config);
  config = withHermesIOS(config);
  config = withHermesMacOS(config);
  config = withHermesWindows(config);
  return config;
}

function withHermesAndroid(config) {
  return withGradleProperties(config, config => {
    const existing = config.modResults.find(
      (item) => item.type === 'property' && item.key === 'expo.jsEngine'
    );

    if (existing) {
      existing.value = 'hermes';
    } else {
      config.modResults.push({
        type: 'property',
        key: 'expo.jsEngine',
        value: 'hermes',
      });
    }

    return config;
  });
}

function withHermesIOS(config) {
  return withPodfileProperties(config, config => {
    config.modResults['expo.jsEngine'] = 'hermes';
    return config;
  });
}

function withHermesMacOS(config) {
  return withMacOSPodfileProperties(config, config => {
    config.modResults.contents['expo.jsEngine'] = 'hermes';
    return config;
  });
}

function withHermesWindows(config) {
  return withWindowsExperimentalFeatures(config, { useHermes: true });
}

module.exports = withHermes;

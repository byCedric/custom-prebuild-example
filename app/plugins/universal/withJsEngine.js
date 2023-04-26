const { withGradleProperties, withPodfileProperties } = require('expo/config-plugins');

/**
 * Switch JS engines on all supported platforms, including all out-of-tree platforms.
 * Supported property is:
 *   - `engine` - `hermes` or `jsc`
 *
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
function withJsEngine(config, options = { engine: 'jsc' }) {
  config = withHermesAndroid(config, options);
  config = withHermesIOS(config, options);
  config = withHermesMacOS(config, options);
  config = withHermesWindows(config, options);
  return config;
}

function withHermesAndroid(config, { engine } = { engine: 'jsc' }) {
  return withGradleProperties(config, config => {
    const existing = config.modResults.find(
      (item) => item.type === 'property' && item.key === 'expo.jsEngine'
    );

    if (existing) {
      existing.value = engine;
    } else {
      config.modResults.push({
        type: 'property',
        key: 'expo.jsEngine',
        value: engine,
      });
    }

    return config;
  });
}

function withHermesIOS(config, { engine } = { engine: 'jsc' }) {
  return withPodfileProperties(config, config => {
    config.modResults['expo.jsEngine'] = engine;
    return config;
  });
}

/** Lazy-plugin, only runs when the macos podfile properties plugin was found. */
function withHermesMacOS(config, { engine } = { engine: 'jsc' }) {
  try {
    const { withMacOSPodfileProperties } = require('../macos/base');
    return withMacOSPodfileProperties(config, config => {
      config.modResults.contents['expo.jsEngine'] = engine;
      return config;
    });
  } catch {
    return config; // Skip this plugin
  }
}

/**
 * Lazy-plugin, only runs when the macos podfile properties plugin was found.
 * Note, Windows uses Chakra instead of JSC
 */
function withHermesWindows(config, { engine } = { engine: 'jsc' }) {
  try {
    const withWindowsExperimentalFeatures = require('../windows/withExperimentalFeatures');
    return withWindowsExperimentalFeatures(config, { useHermes: engine === 'hermes' });
  } catch {
    return config; // Skip this plugin
  }
}

module.exports = withJsEngine;

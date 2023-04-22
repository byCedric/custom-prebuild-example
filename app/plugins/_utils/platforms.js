const { WarningAggregator, withMod } = require('@expo/config-plugins');
const { provider, withGeneratedBaseMods } = require('@expo/config-plugins/build/plugins/createBaseMod');

/**
 * @typedef {import('@expo/config-plugins').ExportedConfig} ExportedConfig
 * @typedef {import('@expo/config-plugins').ConfigPlugin<import('@expo/config-plugins').Mod<unknown>>} UnknownConfigPlugin
 * @typedef {import('@expo/config-plugins/build/plugins/createBaseMod').provider} ModProvider
 */

/**
 * Create a platform specific warning aggregator.
 *
 * @param {string} platform
 */
function createPlatformWarning(platform) {
  return WarningAggregator.addWarningForPlatform.bind(this, platform);
}

/**
 * Create a base modifier that contains all information about the platform.
 * This returns a config plugin that must be added as LAST plugin.
 *
 * @param {string} platform - Name of the platform to support
 * @param {Object<string, ModProvider>} providers - Platform-specific (file) providers for mod access
 */
function createPlatformBaseMod(platform, providers) {
  /** @type {Object<string, ModProvider>} */
  const platformProviders = {
    dangerous: provider({
      getFilePath() {
        return '';
      },
      async read() {
        return {};
      },
      async write() {},
    }),
    ...providers,
  };

  /**
   * @param {ExportedConfig} config
   * @param {ModOptions & (typeof defaultProviders)} [props]
   * @return {ExportedConfig}
   */
  return function withBaseMods(config, { providers, ...props } = {}) {
    return withGeneratedBaseMods(config, {
      ...props,
      platform,
      providers: platformProviders,
    });
  }
}

module.exports = {
  createPlatformBaseMod,
  createPlatformWarning,
  modProvider: provider,
  withPlatformMod: withMod,
};

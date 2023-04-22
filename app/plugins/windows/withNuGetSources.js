const { withWindowsNuGet, addWindowsWarning } = require('./base');

/**
 * Modify the `windows/NuGet.Config` file to add certain sources.
 * Supported options are all sections on the nuget config documentation, using a dictionary.
 *
 * @example ```{
 *   packageSources: { 'NuGet.org': 'https://api.nuget.org/v3/index.json' },
 *   disabledPackageSources: {},
 * }```
 *
 * @see https://learn.microsoft.com/en-us/nuget/reference/nuget-config-file
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
function withNuGetSources(c, options = {}) {
  return withWindowsNuGet(c, (config) => {
    const configuration = config.modResults.contents.configuration;

    if (!configuration) {
      addWindowsWarning('NuGet.Config', 'Malformed NuGet.Config file, please generate from a clean state.');
      return config;
    }

    if (options.packageSources) {
      const { add } = createBlock(options.packageSources);
      configuration.packageSources = [{ clear: '', add }];
    }

    if (options.disabledPackageSources) {
      const { add } = createBlock(options.disabledPackageSources);
      configuration.disabledPackageSources = [{ clear: '', add }];
    }

    return config;
  });
}

function createBlock(entries) {
  return {
    add: Object.entries(entries).map(([name, value]) => ({
      $: { key: name, value },
    })),
  };
}

module.exports = withNuGetSources;

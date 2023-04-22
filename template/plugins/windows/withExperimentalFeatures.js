const { withWindowsExperimentalFeatures } = require('./base');

const propertyGroupLabel = 'Microsoft.ReactNative Experimental Features';

/**
 * Modify the `windows/ExperimentalFeatures.props` file to enable/disable features.
 * Supported features are:
 *   - `useHermes` -> Enables default usage of Hermes.
 *   - `useWinUI3` -> Changes compilation to assume use of WinUI 3 instead of System XAML.
 *   - `useNuget` -> Changes compilation to assume use of Microsoft.ReactNative NuGet packages instead of building the framework from source.
 *   - `useReactFeatureSet` -> ??? (no docs found)
 *
 * @type {import('expo/config-plugins').ConfigPlugin}
 */
function withExperimentalFeatures(c, options = {}) {
  return withWindowsExperimentalFeatures(c, (config) => {
    // Find the experimental features block
    const features = config.modResults.contents.Project.PropertyGroup.find(
      property => property.$?.Label === propertyGroupLabel
    );

    // If it doesn't exists, make sure to warn the user
    if (!features) {
      throw new Error(`File is missing <PropertyGroup Label="${propertyGroupLabel}">, replace the malformed file from the template.`);
    }

    // Compare all the options with the features settings, and update where necessary

    if (options.useHermes !== undefined) {
      features.UseHermes = [options.useHermes];
    }

    if (options.useWinUI3 !== undefined) {
      features.UseWinUI3 = [options.useWinUI3];
    }

    if (options.useNuget !== undefined) {
      features.UseExperimentalNuget = [options.useNuget];
    }

    if (options.useReactFeatureSet !== undefined) {
      features.ReactExperimentalFeaturesSet = [options.useReactFeatureSet];
    }

    return config;
  });
};

module.exports = withExperimentalFeatures;

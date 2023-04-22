const { withMod } = require('expo/config-plugins');

const { createFileResolver, getFileInfo, writeFile } = require('../_utils/files');
const { createPlatformWarning, createPlatformBaseMod, modProvider } = require('../_utils/platforms');
const { parseXml, stringifyXml } = require('../_utils/serialization');

/** @typedef {import('@expo/config-plugins').ConfigPlugin<import('@expo/config-plugins').Mod<any>>} ConfigPlugin */

/** Windows specific platform warning aggregator */
const addWindowsWarning = createPlatformWarning('windows');
/** Windows specific file resolver */
const getFilePath = createFileResolver({
  ignoredPaths: ['**/(AppPackages|BundleArtifacts)/**'],
  addWarning: addWindowsWarning,
});

/** The base config plugin that provides access to all windows-specific files */
const withWindowsBaseMod = createPlatformBaseMod('windows', {
  // See: https://learn.microsoft.com/en-us/nuget/reference/nuget-config-file
  nuGet: modProvider({
    getFilePath({modRequest: {projectRoot}}) {
      return getFilePath({
        tag: 'nuget-config',
        fileName: 'NuGet.Config',
        globPattern: 'windows/NuGet.Config',
        projectRoot,
      });
    },
    async read(filePath) {
      const fileInfo = await getFileInfo(filePath, { '.config': 'xml' });
      if (fileInfo.contents) {
        fileInfo.contents = await parseXml(fileInfo.contents);
      }
      return fileInfo;
    },
    async write(filePath, {modResults: {contents}}) {
      await writeFile(filePath, stringifyXml(contents));
    },
  }),

  // See: https://microsoft.github.io/react-native-windows/docs/hermes#using-hermes-in-an-existing-project
  experimentalFeatures: modProvider({
    getFilePath({modRequest: {projectRoot}}) {
      return getFilePath({
        tag: 'experimental-features',
        fileName: 'ExperimentalFeatures.props',
        globPattern: 'windows/ExperimentalFeatures.props',
        projectRoot,
      });
    },
    async read(filePath) {
      const fileInfo = await getFileInfo(filePath, { '.props': 'xml' });
      if (fileInfo.contents) {
        fileInfo.contents = await parseXml(fileInfo.contents);
      }
      return fileInfo;
    },
    async write(filePath, {modResults: {contents}}) {
      await writeFile(filePath, stringifyXml(contents));
    },
  }),
});

/** @type {ConfigPlugin} */
function withWindowsDangerous(config, action) {
  return withMod(config, {
    platform: 'windows',
    mod: 'dangerous',
    action,
  });
}

/** @type {ConfigPlugin} */
function withWindowsNuGet(config, action) {
  return withMod(config, {
    platform: 'windows',
    mod: 'nuGet',
    action,
  });
}

/** @type {ConfigPlugin} */
function withWindowsExperimentalFeatures(config, action) {
  return withMod(config, {
    platform: 'windows',
    mod: 'experimentalFeatures',
    action,
  });
}

// Export all windows specific config plugins
module.exports = {
  addWindowsWarning,
  withWindowsBaseMod,
  withWindowsDangerous,
  withWindowsNuGet,
  withWindowsExperimentalFeatures,
};

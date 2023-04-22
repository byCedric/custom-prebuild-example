const { withMod } = require('expo/config-plugins');

const { createFileResolver, getFileInfo, writeFile } = require('../_utils/files');
const { createPlatformWarning, createPlatformBaseMod, modProvider } = require('../_utils/platforms');

/** MacOS specific platform warning aggregator */
const addMacOSWarning = createPlatformWarning('macos');
/** MacOS specific file resolver */
const getFilePath = createFileResolver({ addWarning: addMacOSWarning });

/** The base config plugin that provides access to all macos-specific files */
const withMacOSBaseMod = createPlatformBaseMod('macos', {
  viewController: modProvider({
    getFilePath({modRequest: {projectRoot}}) {
      return getFilePath({
        tag: 'view-controller',
        fileName: 'ViewController.m',
        globPattern: 'macos/**/ViewController.m',
        projectRoot,
      });
    },
    async read(filePath) {
      return await getFileInfo(filePath, { '.m': 'objc' });
    },
    async write(filePath, {modResults: {contents}}) {
      await writeFile(filePath, contents);
    },
  }),
});

/** @type {ConfigPlugin} */
function withMacOSDangerous(config, action) {
  return withMod(config, {
    platform: 'macos',
    mod: 'dangerous',
    action,
  });
}

/** @type {ConfigPlugin} */
function withMacOSViewController(config, action) {
  return withMod(config, {
    platform: 'macos',
    mod: 'viewController',
    action,
  });
}

// Export all macos specific config plugins
module.exports = {
  addMacOSWarning,
  withMacOSBaseMod,
  withMacOSDangerous,
  withMacOSViewController,
};

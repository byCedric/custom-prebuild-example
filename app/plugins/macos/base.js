const {BaseMods, withMod} = require('expo/config-plugins');
const path = require('path');
const fs = require('fs');

const {getLanguage, getViewControllerPath} = require('./utils');

/** This adds a core base mod to prebuild, should be last config plugin */
module.exports = function withViewControllerBaseMod(config) {
  return BaseMods.withGeneratedBaseMods(config, {
    platform: 'macos',
    providers: {
      viewController: BaseMods.provider({
        getFilePath({modRequest: {projectRoot}}) {
          return getViewControllerPath(projectRoot);
        },
        async read(filePath) {
          return {
            path: path.normalize(filePath),
            contents: await fs.promises.readFile(filePath, 'utf8'),
            language: getLanguage(filePath),
          };
        },
        async write(filePath, {modResults: {contents}}) {
          await fs.promises.writeFile(filePath, contents);
        },
      }),
    },
  });
};

/** Modify the macos/.../withViewController.m file */
module.exports.withViewController = function withViewController(
  config,
  action,
) {
  return withMod(config, {
    platform: 'macos',
    mod: 'viewController',
    action,
  });
};

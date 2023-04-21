const {addWarningForPlatform} = require('expo/config-plugins');
const {sync: glob} = require('glob');
const path = require('path');

function getLanguage(filePath) {
  const extension = path.extname(filePath);
  switch (extension) {
    case '.mm':
      return 'objcpp';
    case '.m':
    case '.h':
      return 'objc';
    case '.swift':
      return 'swift';
    default:
      throw new Error(`Unexpected MacOS file extension: ${extension}`);
  }
}

// See: https://github.com/expo/expo/blob/main/packages/@expo/config-plugins/src/ios/Paths.ts#L21-L45
const ignoredPaths = ['**/@(Carthage|Pods|vendor|node_modules)/**'];

function getViewControllerPath(projectRoot) {
  const [using, ...extra] = glob('macos/*/ViewController.m', {
    absolute: true,
    cwd: projectRoot,
    ignore: ignoredPaths,
  });

  if (!using) {
    throw new Error(
      `Could not locate a valid ViewController header at root: "${projectRoot}"`,
    );
  }

  if (extra.length) {
    warnMultipleFiles({
      tag: 'view-controller',
      fileName: 'ViewController',
      projectRoot,
      using,
      extra,
    });
  }

  return using;
}

// See: https://github.com/expo/expo/blob/main/packages/%40expo/config-plugins/src/utils/warnings.ts#L35-L42
const addWarningMacOS = (...args) => addWarningForPlatform('macos', ...args);

function warnMultipleFiles({tag, fileName, projectRoot, using, extra}) {
  const usingPath = projectRoot ? path.relative(projectRoot, using) : using;
  const extraPaths = projectRoot
    ? extra.map(v => path.relative(projectRoot, v))
    : extra;
  addWarningMacOS(
    `paths-${tag}`,
    `Found multiple ${fileName} file paths, using "${usingPath}". Ignored paths: ${JSON.stringify(
      extraPaths,
    )}`,
  );
}

module.exports = {
  getViewControllerPath,
  getLanguage,
};

const fs = require('fs');
const path = require('path');
const { sync: glob } = require('glob');

// See: https://github.com/expo/expo/blob/main/packages/@expo/config-plugins/src/ios/Paths.ts#L21-L45
const defaultIgnoredPaths = ['**/@(Carthage|Pods|vendor|node_modules)/**'];

/**
 * Create a file resolver that targets a single file, by glob patter.
 * If multiple files are found, a warning is added.
 * If none are found, an error is thrown.
 *
 * @param {{ ignoredPaths: string[], addWarning: (tag: string, message: string) => void}}
 */
function createFileResolver({ ignoredPaths = [], addWarning }) {
  return function getFilePath({ projectRoot, globPattern, tag, fileName }) {
    const [filePath, ...duplicatePaths] = glob(globPattern, {
      absolute: true,
      cwd: projectRoot,
      ignore: ignoredPaths.concat(defaultIgnoredPaths),
    });

    if (!filePath) {
      throw new Error(`Could not locate project file: ${globPattern}`,)
    }

    if (duplicatePaths.length) {
      warnDuplicateFiles({
        tag,
        fileName,
        projectRoot,
        filePath,
        duplicatePaths,
        addWarning,
      });
    }

    return filePath;
  }
}

function warnDuplicateFiles({ projectRoot, filePath, duplicatePaths, fileName, addWarning }) {
  const relativeFilePath = projectRoot ? path.relative(projectRoot, filePath) : filePath;
  const relativeDuplicatePaths = projectRoot
    ? duplicatePaths.map(v => path.relative(projectRoot, v))
    : duplicatePaths;
  addWarning(
    `paths-${tag}`,
    `Found multiple ${fileName} file paths, using "${relativeFilePath}". Ignored paths: ${JSON.stringify(
      relativeDuplicatePaths,
    )}`,
  );
}

/**
 * Fetch basic file information for a give file path.
 * Note, this also needs a dictionary of file extensions to languages.
 *
 * @param {string} filePath
 * @param {Object<string, string>} languages
 * @returns {Promise<{ path: string, contents: string, language: string }>}
 */
async function getFileInfo(filePath, languages) {
  const extension = path.extname(filePath);
  const language = languages[extension?.toLowerCase()];

  if (!language) {
    throw new Error(`Unexpected file extension: ${extension}`);
  }

  return {
    path: path.normalize(filePath),
    contents: await fs.promises.readFile(filePath, 'utf8'),
    language,
  };
}

/**
 * Modify a file directly, by overwriting it.
 *
 * @param {string} filePath
 * @param {string} contents
 * @returns {Promise<void>}
 */
function writeFile(filePath, contents) {
  return fs.promises.writeFile(filePath, contents, 'utf8');
}

module.exports = {
  createFileResolver,
  getFileInfo,
  writeFile,
};

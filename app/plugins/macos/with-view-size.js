const {createRunOncePlugin} = require('expo/config-plugins');
const {withViewController} = require('./base');

const INSERT_PATTERN = 'NSView *view = [self view];';

/**
 * This plugin adds `[view setFrameSize:...]` that should set the initial screen size of a macos app.
 * @type {import('@expo/config-plugins').ConfigPlugin}
 */
function withViewSize(c, {width = 800, height = 600} = {}) {
  return withViewController(c, config => {
    if (config.modResults.language !== 'objc') {
      throw new Error(
        'View controller must be Objective-C to use withViewSize.',
      );
    }

    const insertText = `[view setFrameSize:NSMakeSize(${width}, ${height})];`;

    config.modResults.contents = config.modResults.contents.replace(
      INSERT_PATTERN,
      `${INSERT_PATTERN}\n  ${insertText}`,
    );

    return config;
  });
}

module.exports = createRunOncePlugin(withViewSize, 'withViewSize', '1.0.0');

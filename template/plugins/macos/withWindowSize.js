const assert = require('assert');
const {createRunOncePlugin} = require('expo/config-plugins');
const {withMacOSViewController} = require('./base');

const INSERT_PATTERN = 'NSView *view = [self view];';

/**
 * This plugin adds `[view setFrameSize:...]` that should set the initial screen size of a macos app.
 * @type {import('@expo/config-plugins').ConfigPlugin}
 */
function withWindowSize(c, {width = 800, height = 600} = {}) {
  return withMacOSViewController(c, config => {
    assert(config.modResults.language === 'objc', 'View controller must be Objective-C to use withViewSize.');

    const insertText = `[view setFrameSize:NSMakeSize(${width}, ${height})];`;

    config.modResults.contents = config.modResults.contents.replace(
      INSERT_PATTERN,
      `${INSERT_PATTERN}\n  ${insertText}`,
    );

    return config;
  });
}

module.exports = createRunOncePlugin(withWindowSize, 'withViewSize', '1.0.0');

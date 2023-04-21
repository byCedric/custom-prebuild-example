const {withAndroidStyles, createRunOncePlugin} = require('expo/config-plugins');

/** Disable the default Android changes in react native apps */
function withoutSplashScreen(c) {
  return withAndroidStyles(c, config => {
    // Filter out the default Expo styles
    config.modResults.resources.style =
      config.modResults.resources.style.filter(
        style => !isExpoAppTheme(style) && !isExpoSplashScreen(style),
      );

    return config;
  });
}

function isExpoAppTheme(style) {
  return (
    style.$?.name === 'AppTheme' &&
    style.$?.parent === 'Theme.AppCompat.Light.NoActionBar'
  );
}

function isExpoSplashScreen(style) {
  return (
    style.$?.name === 'Theme.App.SplashScreen' && style.$?.parent === 'AppTheme'
  );
}

module.exports = createRunOncePlugin(
  withoutSplashScreen,
  'withoutSplashScreen',
  '1.0.0',
);

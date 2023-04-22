module.exports = {
  dependencies: {
    // Just for demonstration purposes: a React Native app, without any Expo native code...
    // _While still leveraging Expo Prebuild and Expo Config Plugins, using an out-of-tree platform._
    expo: {
      platforms: {
        android: null,
        ios: null,
        macos: null,
      },
    },
  },
};

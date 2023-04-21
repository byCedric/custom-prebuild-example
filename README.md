<div align="center">
  <h1>Customized Prebuild Example</h1>
  <p>Demonstration of out-of-tree platforms with <a href="https://docs.expo.dev/workflow/prebuild/">prebuild</a> and <a href="https://docs.expo.dev/config-plugins/introduction/">config plugins</a></p>
  <p>
    <a href="https://github.com/byCedric/custom-prebuild-example#-project-structure"><b>Structure</b></a>
    &ensp;&mdash;&ensp;
    <a href="https://github.com/byCedric/custom-prebuild-example#-how-to-use-it"><b>Use it</b></a>
    &ensp;&mdash;&ensp;
    <a href="https://github.com/byCedric/custom-prebuild-example#-how-to-customize-it"><b>Customize it</b></a>
  </p>
  <br/>
</div>

This project demonstrates how Expo Prebuild could be leveraged to run on out-of-tree platforms, with fully customizable templates.
It's set-up to use prebuild for `android`, `ios`, and `macos`, using the custom template from this repository.

> **Warning**
> We recently merged [PR #22224](https://github.com/expo/expo/pull/22224) and [PR #22201](https://github.com/expo/expo/pull/22201), which is required for this demonstration.
> Because these pull requests aren't released yet, this repository contains a modified `@expo/cli` and `@expo/config-plugin` versions. (see [./vendored](./vendored))

## 📁 Project Structure

- [`app`](./app) - Example app, created using `npx react-native init`
- [`app/plugins/macos`](./app/plugins/macos) - Registers the `macos` platform with a single modifier and plugin
- [`template`](./template) - A customized prebuild template

## 🚀 How to use it

To get your hands dirty, follow these steps.

- `$ cd ./template` - Before you can use prebuild, we have to create a template tarball
- `$ npm pack` - This creates a tarball that we can pass to prebuild

After this, you can generate the native files for any of the platforms below.
All of the platform folders (`./android`, `./ios`, and `./macos`) are gitignored and can be fully regenerated.
Use `... prebuild --clean` or `rm -rf ./macos` to regenerate the files.

### MacOS

- `$ cd ./app` - Go to the app folder
- `$ bundle install` - Install all gems
- `$ yarn install` - Install all modules, including prebuild
- `$ npx expo prebuild --platform macos --template ../template/custom-prebuild-template-1.0.0.tgz` - Use prebuild to generate the `./android` folder
- `$ npx pod-install macos` - Make sure the pods for `./macos` are installed
- `$ npx react-native run-macos` - Run the project normally

> **Note**
> This not only generates the files from the template, it also runs the [`./app/plugins/macos/with-view-size.js`](./app/plugins/macos/with-view-size.js) plugin.
> Try to customize these window dimensions in [`./app/app.json`](./app/app.json) and let prebuild configure the native files for you.

### Android

- `$ cd ./app` - Go to the app folder
- `$ bundle install` - Install all gems
- `$ yarn install` - Install all modules, including prebuild
- `$ npx expo prebuild --platform android --template ../template/custom-prebuild-template-1.0.0.tgz` - Use prebuild to generate the `./android` folder
- `$ npx react-native run-android` - Run the project normally

### iOS

- `$ cd ./app` - Go to the app folder
- `$ bundle install` - Install all gems
- `$ yarn install` - Install all modules, including prebuild
- `$ npx expo prebuild --platform ios --template ../template/custom-prebuild-template-1.0.0.tgz` - Use prebuild to generate the `./ios` folder
- `$ npx react-native run-ios` - Run the project normally

## 👷 How to customize it

Take a look at the existing prebuild plugins, especially the `macos` part.
This can be done for any platform, modifier, or change required.
[Learn more about custom base modifiers](https://docs.expo.dev/config-plugins/development-and-debugging/#custom-base-modifiers)

<div align="center">
  <br />
  with&nbsp;❤️&nbsp;&nbsp;<strong>Expo</strong>
  <br />
</div>

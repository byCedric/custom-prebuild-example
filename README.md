<div align="center">
  <h1>Customized Prebuild Example</h1>
  <p>Demonstration of out-of-tree platforms with prebuild and config plugins</p>
  <p>
    <a href="https://github.com/byCedric/custom-prebuild-example#-project-structure"><b>Structure</b></a>
    &ensp;&mdash;&ensp;
    <a href="https://github.com/byCedric/custom-prebuild-example#-how-to-use-it"><b>Use it</b></a>
    &ensp;&mdash;&ensp;
    <a href="https://github.com/byCedric/custom-prebuild-example#-how-to-customize-it"><b>Customize it</b></a>
  </p>
  <br/>
</div>

## 📁 Project Structure

- [`app`](./app) - Example app to run prebuild with any platform
- [`template`](./template) - The template project used when prebuilding

## 🚀 How to use it

To get your hands dirty, follow these steps.

- `$ cd ./app` - The app serves as a playground testing out-of-tree platforms for prebuild
- `$ yarn install` - Install all modules with yarn
- `$ yarn expo prebuild --platform foo` - Run prebuild with an out-of-tree platform, defined in the template

## 👷 How to customize it

Prebuild is designed to execute changes on specific files, using the template as starting state.
This also works for platforms that are considered "out-of-tree".

<div align="center">
  <br />
  with&nbsp;❤️&nbsp;&nbsp;<strong>Expo</strong>
  <br />
</div>
